const {
  Exam,
  StudentExam,
  Question,
  Course,
  User,
  Student_Course,
  Instructor_Course,
} = require("../db/Database");
const { v4: uuidv4 } = require("uuid");

async function findCOurseIdByTitle(title) {
  return Course.findOne({ title: title }).then((course) => {
    if (!course) return null;
    return course._id;
  });
}

async function findExamIdByTitle(title) {
  return Exam.findOne({ title: title }).then((exam) => {
    if (!exam) return null;
    return exam._id;
  });
}
module.exports.createExam = async (req, res, next) => {
  try {
    const { title, courseTitle, sDate, duration, eDate } = req.body;

    if (!title || !courseTitle || !sDate || !duration || !eDate) {
      return res.status(200).json({ error: "All fields are required" });
    }

    if (eDate < sDate) {
      return res
        .status(200)
        .json({ error: "End date must be greater than start date" });
    }
    if (eDate < new Date()) {
      return res.status(200).json({ error: "End date must be in the future" });
    }
    const courseId = await findCOurseIdByTitle(courseTitle);
    const exam = new Exam({
      id: uuidv4(),
      courseID: courseId,
      title,
      startDate: sDate,
      duration,
      endDate: eDate,
    });
    await exam.save();
    res.status(201).json({ message: "Exam created successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: createExam function => ${error}`);
  }
};

module.exports.addQuestions = async (req, res, next) => {
  try {
    const { examTitle, questions } = req.body;
    const examID = await findExamIdByTitle(examTitle);
    if (!examID) {
      return res.status(200).json({ error: "Exam not found" });
    }

    if (!questions || questions.length === 0) {
      return res
        .status(200)
        .json({ error: "Exam must at least have one question" });
    }

    for (const questionData of questions) {
      const { title, answers, indexOfCorrectAnswer } = questionData;
      if (!title || !answers || indexOfCorrectAnswer === undefined) {
        return res.status(200).json({
          error:
            "Please ensure that the title, answers, and the index of the correct answer are assigned",
        });
      }
      const correctAnswer = answers[indexOfCorrectAnswer];
      const question = new Question({
        id: uuidv4(),
        title,
        answers,
        correctAnswer,
        examID,
      });
      await question.save();
    }

    res.status(201).json({ message: "Questions were added successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: addQuestions function => ${error}`);
  }
};

module.exports.getExamsforAdmins = async (req, res, next) => {
  try {
    const exams = await Exam.find();
    const examsInfo = [];
    for (const exam of exams) {
      examsInfo.push({
        courseTitle: Course.findOne({ _id: exam.courseID }).title,
        title: exam.title,
        startDate: exam.startDate,
        endDate: exam.endDate,
        duration: exam.duration,
      });
    }
    res.status(201).json({ data: examsInfo });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getExams function => ${error}`);
  }
};

module.exports.getExamsforStudents = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(200).json({ error: "Student ID is required" });
    }
    const studentExams = await StudentExam.find({ studentID: studentId });
    if (!studentExams || studentExams.length === 0) {
      return res.status(200).json({ error: "There are no exams for you yet!" });
    }
    const examsId = studentExams.map((exam) => exam.examID);
    const examList = await Exam.find({ _id: { $in: examsId } });
    const examsInfo = [];
    for (const exam of examList) {
      const course = await Course.findOne({ _id: exam.courseID }); // Await the findOne method
      examsInfo.push({
        courseTitle: course.title,
        title: exam.title,
        startDate: exam.startDate,
        endDate: exam.endDate,
        duration: exam.duration,
      });
    }
    res.status(201).json({ data: examsInfo });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getExams function => ${error}`);
  }
};

module.exports.getExamQuestions = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { userId } = req.body;
    if (!examId) {
      return res.status(200).json({ error: "Exam ID is required" });
    }
    if (!userId) {
      return res.status(200).json({ error: "User ID is required" });
    }
    const exam = await Exam.findOne({ id: examId });
    if (!exam) {
      return res.status(200).json({ error: "Exam not found" });
    }
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }
    if (
      user.role.toLowerCase() !== "admin"
    ) {
      if (user.role.toLowerCase() === "student") {
        const studentCourse = await Student_Course.findOne({
          studentID: user._id,
          courseID: exam.courseID,
        });
        if (!studentCourse) {
          return res.status(200).json({ error: "User not authorized" });
        }
      }
      if (user.role.toLowerCase() === "instructor") {
        const instructorCourse = await Instructor_Course.findOne({
          instructorID: user._id,
          courseID: exam.courseID,
        });
        if (!instructorCourse) {
          return res.status(200).json({ error: "User not authorized" });
        }
      }
    }
    const questions = await Question.find({ examID: exam._id });
    if (!questions) {
      return res.status(200).json({
        error: "This exam doesn't contain any questions",
        data: exam.title,
      });
    }
    let responsedQuestionData = [];
    for (const question of questions) {
      responsedQuestionData.push({
        id: question.id,
        title: question.title,
        answers: question.answers,
        correctAnswer: question.correctAnswer,
      });
    }
    const responsedData = {
      ExamTitle: exam.title,
      questions: responsedQuestionData,
      duration: exam.duration,
    };
    res.status(201).json({ data: responsedData });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getExam function => ${error}`);
  }
};

module.exports.deleteExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    if (!examId) {
      return res.status(200).json({ error: "Exam ID is required" });
    }
    const exam = await Exam.findOne({ id: examId });
    if (!exam) {
      return res.status(200).json({ error: "Exam not found" });
    }
    const questions = await Question.find({ examID: exam._id });
    if (questions.length > 0) {
      for (const question of questions) {
        await Question.deleteOne({ id: question.id });
      }
    }
    await Exam.deleteOne({ id: examId });
    res.status(201).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: deleteExam function => ${error}`);
  }
};

module.exports.updateExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    if (!examId) {
      return res.status(200).json({ error: "Exam ID is required" });
    }
    const exam = await Exam.findOne({ id: examId });
    if (!exam) {
      return res.status(200).json({ error: "Exam not found" });
    }
    const { title, sDate, duration, eDate } = req.body;
    if (!title || !sDate || !duration || !eDate) {
      return res.status(200).json({ error: "All fields are required" });
    }
    if (exam.title !== title) {
      exam.title = title;
    }
    if (exam.startDate !== sDate) {
      exam.startDate = sDate;
    }
    if (exam.duration !== duration) {
      exam.duration = duration;
    }
    if (exam.endDate !== eDate) {
      exam.endDate = eDate;
    }
    await exam.save();
    res.status(201).json({ message: "Exam updated successfully", exam });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: updateExam function => ${error}`);
  }
};

module.exports.updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(200).json({ error: "Question ID is required" });
    }
    const question = await Question.findOne({ id: questionId });
    if (!question) {
      return res.status(200).json({ error: "Question not found" });
    }
    const { title, answers, indexOfCorrectAnswer } = req.body;
    if (!title || !answers || indexOfCorrectAnswer === undefined) {
      return res.status(200).json({ error: "All fields are required" });
    }
    if (question.title !== title) {
      question.title = title;
    }
    if (question.answers !== answers) {
      question.answers = answers;
    }
    let questionAnswers = question.answers;

    if (questionAnswers[indexOfCorrectAnswer] !== question.correctAnswer) {
      question.correctAnswer = questionAnswers[indexOfCorrectAnswer];
    }
    await question.save();
    res
      .status(201)
      .json({ message: "Question updated successfully", question });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: updateQuestion function => ${error}`);
  }
};

module.exports.deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(200).json({ error: "Question ID is required" });
    }
    const question = await Question.findOne({ id: questionId });
    if (!question) {
      return res.status(200).json({ error: "Question not found" });
    }
    await Question.deleteOne({ id: questionId });
    res.status(201).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: deleteQuestion function => ${error}`);
  }
};

module.exports.finishSolvingExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    if (!examId) {
      return res.status(200).json({ error: "Exam ID is required" });
    }
    const exam = await Exam.findOne({ id: examId });
    if (!exam) {
      return res.status(200).json({ error: "Exam not found" });
    }
    const { studentId, grade, submissionDate } = req.body;
    if (!studentId || !submissionDate) {
      return res.status(200).json({ error: "All fields are required" });
    }
    const student = await User.findOne({ id: studentId });
    if (!student) {
      return res.status(200).json({ error: "Student not found" });
    }
    const submitExam = new StudentExam({
      examID: examId,
      studentID: studentId,
      grade,
    });
    await submitExam.save();
    // if (submissionDate > exam.endDate) {
    //   studentExam.grade = 0;
    // } else {
    //   studentExam.grade = grade;
    // }
    res.status(201).json({ message: "Exam solved successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: finishSolvingExam function => ${error}`);
  }
};
