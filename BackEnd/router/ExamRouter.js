const { Router } = require("express");
const Controller = require("../controller/Exam");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post("/createExam", verifyToken("Instructor"), Controller.createExam); 

router.post(
  "/addQuestions",
  verifyToken("Instructor"),
  Controller.addQuestions
); 

router.get(
  "/getExamsForAdmins",
  verifyToken("Admin"),
  Controller.getExamsforAdmins
); 

router.get(
  "/getExamsForStudents/:studentId",
  verifyToken("Student"),
  Controller.getExamsforStudents
); 

router.post("/getExam/:examId", verifyToken(), Controller.getExamQuestions);

router.put(
  "/updateExam/:examId",
  verifyToken("Instructor"),
  Controller.updateExam
); 

router.delete(
  "/deleteExam/:examId",
  verifyToken("Instructor"),
  Controller.deleteExam
); 

router.put(
  "/updateQuestion/:questionId",
  verifyToken("Instructor"),
  Controller.updateQuestion
); 

router.delete(
  "/deleteQuestion/:questionId",
  verifyToken("Instructor"),
  Controller.deleteQuestion
); 

router.post(
  "/solveExam/:examId",
  verifyToken("Student"),
  Controller.finishSolvingExam
); 

module.exports = router;
