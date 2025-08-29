const { Course, Student_Course, Instructor_Course, Assignment, AssignmentAnswer, Exam, Question, StudentExam, Post, Comment, Reply } = require('./db/Database');
const { v4 } = require('uuid');
const fs = require('fs');
const path = require('path');

async function manageCourses() {
    try {
        console.log('Starting course management...');

        // Step 1: Get all existing courses
        const existingCourses = await Course.find({});
        console.log(`Found ${existingCourses.length} existing courses:`);
        existingCourses.forEach(course => {
            console.log(`- ${course.title} (ID: ${course.id})`);
        });

        // Step 2: Remove all course-related data
        console.log('\nRemoving all existing courses and related data...');

        // Remove all student-course relationships
        await Student_Course.deleteMany({});
        console.log('Removed all student-course relationships');

        // Remove all instructor-course relationships
        await Instructor_Course.deleteMany({});
        console.log('Removed all instructor-course relationships');

        // Remove all assignment answers
        await AssignmentAnswer.deleteMany({});
        console.log('Removed all assignment answers');

        // Remove all assignments
        await Assignment.deleteMany({});
        console.log('Removed all assignments');

        // Remove all student exam records
        await StudentExam.deleteMany({});
        console.log('Removed all student exam records');

        // Remove all questions
        await Question.deleteMany({});
        console.log('Removed all questions');

        // Remove all exams
        await Exam.deleteMany({});
        console.log('Removed all exams');

        // Remove all replies
        await Reply.deleteMany({});
        console.log('Removed all replies');

        // Remove all comments
        await Comment.deleteMany({});
        console.log('Removed all comments');

        // Remove all posts
        await Post.deleteMany({});
        console.log('Removed all posts');

        // Remove all courses
        await Course.deleteMany({});
        console.log('Removed all courses');

        // Step 3: Clean up course images and assignment files
        const coursesDir = path.join(__dirname, 'static', 'courses');
        if (fs.existsSync(coursesDir)) {
            const files = fs.readdirSync(coursesDir);
            files.forEach(file => {
                fs.unlinkSync(path.join(coursesDir, file));
            });
            console.log('Cleaned up course images');
        }

        const assignmentsDir = path.join(__dirname, 'static', 'assignments');
        if (fs.existsSync(assignmentsDir)) {
            const files = fs.readdirSync(assignmentsDir);
            files.forEach(file => {
                fs.unlinkSync(path.join(assignmentsDir, file));
            });
            console.log('Cleaned up assignment files');
        }

        const assignmentSolutionsDir = path.join(__dirname, 'static', 'assignments_solutions');
        if (fs.existsSync(assignmentSolutionsDir)) {
            const files = fs.readdirSync(assignmentSolutionsDir);
            files.forEach(file => {
                fs.unlinkSync(path.join(assignmentSolutionsDir, file));
            });
            console.log('Cleaned up assignment solution files');
        }

        // Step 4: Add new courses
        console.log('\nAdding new courses...');

        const newCourses = [
            {
                title: 'Computer Networks',
                desc: 'Learn about computer networking fundamentals, protocols, network architecture, and communication systems.',
                hours: 40,
                id: v4()
            },
            {
                title: 'DBMS',
                desc: 'Database Management Systems covering relational databases, SQL, normalization, and database design principles.',
                hours: 35,
                id: v4()
            },
            {
                title: 'Operating System',
                desc: 'Study operating system concepts including process management, memory management, file systems, and system calls.',
                hours: 45,
                id: v4()
            }
        ];

        for (const courseData of newCourses) {
            const course = new Course(courseData);
            await course.save();
            console.log(`✓ Added course: ${courseData.title} (${courseData.hours} hours)`);
        }

        console.log('\n✅ Course management completed successfully!');
        console.log('New courses:');
        const finalCourses = await Course.find({});
        finalCourses.forEach(course => {
            console.log(`- ${course.title} (${course.hours} hours)`);
        });

    } catch (error) {
        console.error('❌ Error managing courses:', error.message);
    } finally {
        process.exit(0);
    }
}

// Add a delay to ensure database connection
setTimeout(manageCourses, 2000);
