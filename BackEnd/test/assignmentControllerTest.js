const assert = require('assert');  // Use Node.js assert for assertions
const app = require('../index.js');
const {Session, User, Assignment, AssignmentAnswer} = require("../db/Database");  // Import your Express app
const BASE_URL = 'http://localhost:3008';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

let server; let newUser;

// Utility function to safely parse JSON
async function safelyParseJSON(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    } else {
        return null;
    }
}

async function createInitialDocs() {
    // Insert a new user
    newUser = new User({
        name: 'John Doe',
        id: uuidv4(),
        gender: 'Male',
        email: 'john.doe@example.com',
        username: 'test',
        password: bcrypt.hashSync('password', 10),
        role: 'Student'
    });
    await newUser.save();

    // Simulate a user login by creating a session
    await Session.insertMany([
        {
            userID: newUser._id,
            createDate: new Date()
        }
    ]);
}

async function clearInitialDocs() {
    // Clean up after running tests
    await Session.deleteMany({}); await User.deleteMany({});
    await Assignment.deleteMany({}); await AssignmentAnswer.deleteMany({});
}

// Define the test suite
describe('AssignmentController Test Suite', () => {

    before((done) => {
        // Start the server before running tests (if necessary)
        server = app.listen(3009, () => {
            console.log('Test server running on port 3009');
            done();
        });
        createInitialDocs();
    });

    describe('POST /createAssignment', () => {

        // Test valid case
        it('should create a new assignment with valid input', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    duration: 1,
                    endDate: '2024-09-11',
                    title: 'Assignment 1',
                    document: 'Assignment 1 document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });

        // Test for missing required fields
        it('should return an error if any field is missing', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    title: 'Assignment 1',
                    document: 'Assignment 1 document'
                })
            });

            const resBody = await response.json();

            // Basic JavaScript assertions
            assert.strictEqual(response.status, 200);  // Assuming validation returns 200
            assert.strictEqual(typeof resBody.error, 'string');  // Ensure an error is returned
        });
    });

    describe('DELETE /deleteAssignment/:id', () => {
        // Test for non-existent assignment
        it('should return an error if assignment does not exist', async () => {
            const response = await fetch(`${BASE_URL}/deleteAssignment/non-existent-id`, {
                method: 'DELETE'
            });

            const resBody = await response.json();

            // Basic JavaScript assertions
            assert.strictEqual(response.status, 200);  // Check the expected status code (could be 404)
            assert.strictEqual(resBody.error, 'Assignment not found');  // Check for the correct error message
        });
    });

    describe('POST /createAssignment with concurrency', () => {
        it('should handle multiple concurrent requests', async () => {
            const requests = [];
            for (let i = 0; i < 10; i++) {
                requests.push(
                    fetch(`${BASE_URL}/createAssignment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                            startDate: `2024-09-${10 + i}`,
                            duration: 1,
                            endDate: `2024-09-${11 + i}`,
                            title: `Concurrent Assignment ${i + 1}`,
                            document: `Document for concurrent test ${i + 1}`
                        })
                    })
                );
            }

            const responses = await Promise.all(requests);
            responses.forEach(response => {
                assert.strictEqual(response.status, 200); // All requests should succeed
            });
        });
    });

    describe('POST /createAssignment SQL Injection Test', () => {
        it('should prevent SQL injection in title', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    duration: 1,
                    endDate: '2024-09-11',
                    title: "'; DROP TABLE Assignments; --",
                    document: 'Malicious document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment XSS Test', () => {
        it('should prevent XSS in title', async () => {
            const xssString = "<script>alert('XSS');</script>";
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    duration: 1,
                    endDate: '2024-09-11',
                    title: xssString,
                    document: 'XSS Document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment with invalid data types', () => {
        it('should return validation error when using incorrect data types', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: 'invalid-course-id',  // Should be an ID format
                    startDate: 'Invalid Date',  // Should be a valid date format
                    duration: 'Not a Number',  // Should be a number
                    endDate: '2024-09-11',
                    title: 12345,  // Should be a string
                    document: 123456789  // Should be a string
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment with invalid date range', () => {
        it('should return validation error for end date before start date', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-11',
                    duration: 1,
                    endDate: '2024-09-10',  // End date is before the start date
                    title: 'Invalid Date Assignment',
                    document: 'Document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment with overlapping assignment', () => {
        it('should return an error when creating an overlapping assignment', async () => {
            // First, create an assignment
            await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: new Date() - 1000 * 60 * 60,
                    duration: 1,
                    endDate: new Date(),
                    title: 'First Assignment',
                    document: 'First Document'
                })
            });

            // Now try to create another assignment that overlaps with the first
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: new Date() - 1000 * 60 * 60,
                    duration: 1,
                    endDate: new Date(),
                    title: 'Overlapping Assignment',
                    document: 'Overlapping Document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment with duplicate title', () => {
        it('should return an error for duplicate titles within the same course', async () => {
            // First create an assignment with a specific title
            await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    duration: 1,
                    endDate: '2024-09-11',
                    title: 'Duplicate Title',
                    document: 'First Assignment Document'
                })
            });

            // Now attempt to create another assignment with the same title in the same course
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-12',
                    duration: 1,
                    endDate: '2024-09-13',
                    title: 'Duplicate Title',
                    document: 'Second Assignment Document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /solveAssignment', () => {
        it('should successfully submit an assignment with valid data', async () => {
            const assignment = await Assignment.findOne();

            if (!assignment) {
                assert.fail(`No assignment found in the database. Please create an assignment first.`);
            }

            const response = await fetch(`${BASE_URL}/solveAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentID: assignment._id,
                    document: 'Submitted assignment document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);


            // Check if there's an error key in the response
            if (resBody && resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });

        it('should return an error if assignment ID or document is missing', async () => {
            const response = await fetch(`${BASE_URL}/solveAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document: 'No assignment ID' }) // Missing assignment ID
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });

        it('should return an error if the user is not logged in', async () => {

            const assignmentId = await Assignment.findOne().select('_id');

            if (!assignmentId) {
                assert.fail('No assignment found in the database. Please create an assignment first.');
            }

            const response = await fetch(`${BASE_URL}/solveAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentID: assignmentId,
                    document: 'Submitted assignment document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('GET /getAssignments', () => {
        it('should return a list of assignments', async () => {
            const response = await fetch(`${BASE_URL}/getAssignments`, {
                method: 'GET',
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('GET /getAssignment/:id', () => {
        it('should return a single assignment with a valid ID', async () => {
            const assignment = await Assignment.findOne();

            if (!assignment) {
                assert.fail(`No assignment found in the database. Please create an assignment first.`);
            }

            const response = await fetch(`${BASE_URL}/getAssignment/${assignment.id}`, {
                method: 'GET',
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });

        it('should return an error if assignment is not found', async () => {
            const response = await fetch(`${BASE_URL}/getAssignment/invalid-assignment-id`, {
                method: 'GET',
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('PUT /updateAssignment/:id', () => {
        it('should successfully update an assignment', async () => {
            const assignment = await Assignment.findOne();

            if (!assignment) {
                assert.fail(`No assignment found in the database. Please create an assignment first.`);
            }

            const response = await fetch(`${BASE_URL}/updateAssignment/${assignment.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Updated Assignment Title',
                    document: 'Updated document',
                    startDate: '2024-09-15',
                    endDate: '2024-09-16',
                    duration: 2
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });

        it('should return an error if assignment does not exist', async () => {
            const response = await fetch(`${BASE_URL}/updateAssignment/invalid-assignment-id`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Updated Assignment Title',
                    document: 'Updated document',
                    startDate: '2024-09-15',
                    endDate: '2024-09-16',
                    duration: 2
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('DELETE /deleteAssignment/:id', () => {
        it('should delete an assignment successfully', async () => {
            const assignment = await Assignment.findOne();

            if (!assignment) {
                assert.fail(`No assignment found in the database. Please create an assignment first.`);
            }

            const response = await fetch(`${BASE_URL}/deleteAssignment/${assignment.id}`, {
                method: 'DELETE',
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });

        it('should return an error if assignment does not exist', async () => {
            const response = await fetch(`${BASE_URL}/deleteAssignment/invalid-assignment-id`, {
                method: 'DELETE',
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    after((done) => {
        // Stop the server after running tests
        server.close(done);
        clearInitialDocs();
    });

});
