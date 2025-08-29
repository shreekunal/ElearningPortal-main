const { Router } = require('express');
const {
    Controller, uploadAssignmentDoc, assignment_doc_upload,
    assignment_answer_upload, uploadAssignmentAnswerDoc
} = require('../controller/Assignment');
const verifyToken = require('../controller/VerifyToken');
const router = Router();

router.post('/createAssignment', verifyToken("Admin"),
    assignment_doc_upload.single('pdf'), uploadAssignmentDoc, Controller.createAssignment);
router.post('/solveAssignment', verifyToken("Student"),
    assignment_answer_upload.single('pdf'), uploadAssignmentAnswerDoc, Controller.solveAssignment);
router.delete('/deleteAssignmentSolution/:id', verifyToken("Student"), Controller.deleteAssignmentAnswer);
router.post('/gradeAssignment', verifyToken("Instructor"), Controller.gradeAssignment);
router.put('/updateAssignment/:id', verifyToken("Instructor"),
    assignment_doc_upload.single('pdf'), uploadAssignmentDoc, Controller.updateAssignment);
router.put('/updateAssignmentAnswer/:id', verifyToken(),
    assignment_answer_upload.single('pdf'), uploadAssignmentAnswerDoc, Controller.updateAssignmentAnswer);
router.get('/getAssignments', verifyToken(), Controller.getAllAssignments);
router.get('/getAssignment/:id', verifyToken(), Controller.getAssignmentById);
router.delete('/deleteAssignment/:id', verifyToken("Instructor"), Controller.deleteAssignment);
router.get('/getStudentProgress', verifyToken(), Controller.getStudentProgress);
router.get('/getCourseMaterials', verifyToken(), Controller.getCourseMaterials);

module.exports = router;
