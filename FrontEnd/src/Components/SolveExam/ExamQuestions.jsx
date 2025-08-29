import React, { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../App";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../Cookie/Cookie";
import { useParams } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../Loader/Loader";
import "./exam-questions.css";
import CaughtUp from "../../assets/Grades.svg";
import Placeholder from "../Placeholder/Placeholder.jsx";
import { Back_Origin } from "../../../Front_ENV.jsx";

const ExamQuestions = () => {
  const { showMessage } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const { examId } = useParams();
  const route = useLocation();
  const courseId = route.state.courseID;
  const yourToken = getCookie("token");
  const userData = jwtDecode(yourToken);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  const fetchExamHandler = async () => {
    try {
      const response = await fetch(`${Back_Origin}/getExam/${examId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${yourToken}`,
        },
        body: JSON.stringify({
          userId: `${userData.id}`,
        }),
      });
      const data = await response.json();
      setExam(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExamHandler();
  }, [examId]);

  if (!exam) return <Loader />;

  const chooseAnswerHandler = (event) => {
    const answer = event.target.value;
    const correctAnswer = exam.questions[questionIndex].correctAnswer;
    if (answer === correctAnswer) {
      setAnswers([...answers, { answer, isCorrect: true }]);
    } else {
      setAnswers([...answers, { answer, isCorrect: false }]);
    }
    setQuestionIndex((prevQuestionIndex) => prevQuestionIndex + 1);
  };

  const submitAnswersHandler = async () => {
    const numberOfCorrectAnswers = answers.filter(
      (answer) => answer.isCorrect
    ).length;
    const numberOfQuestions = answers.length;
    const grade = (numberOfCorrectAnswers / numberOfQuestions) * 100;
    try {
      const response = await fetch(`${Back_Origin}/solveExam/${examId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${yourToken}`,
        },
        body: JSON.stringify({
          studentId: `${userData.id}`,
          grade,
          submissionDate: new Date(),
        }),
      });
      const result = await response.json();
      showMessage(result.message, false);
      navigate(`/courses/`);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const handleEditChange = (index, field, value) => {
    const question = exam.questions[index];
    const updatedQuestions = [...exam.questions];
    if (field === "title") {
      updatedQuestions[index].title = value;
    } else if (field === "indexOfCorrectAnswer") {
      updatedQuestions[index].correctAnswer =
        updatedQuestions[index].answers[parseInt(value)];
    } else {
      updatedQuestions[index].answers[field] = value;
    }
    setExam({ ...exam, questions: updatedQuestions });
  };

  const editQuestionHandler = async (index) => {
    const questionId = exam.questions[index].id;
    if (editingIndex === index) {
      try {
        const response = await fetch(
          `${Back_Origin}/updateQuestion/${questionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${yourToken}`,
            },
            body: JSON.stringify({
              title: exam.questions[index].title,
              answers: exam.questions[index].answers,
              indexOfCorrectAnswer: exam.questions[index].answers.indexOf(
                exam.questions[index].correctAnswer
              ),
            }),
          }
        );
        const result = await response.json();
        showMessage(result.message, false);
      } catch (error) {}
      setEditingIndex(null); // Save and exit editing mode
    } else {
      setEditingIndex(index);
      // Enter editing mode for the selected question
    }
  };
  const deleteQuestionHandler = async (index) => {
    const questionId = exam.questions[index].id;
    try {
      const response = await fetch(
        `${Back_Origin}/deleteQuestion/${questionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${yourToken}`,
          },
        }
      );
      const result = await response.json();
      showMessage(result.message, false);
      setExam((prevExam) => ({
        ...prevExam,
        questions: prevExam.questions.filter((_, idx) => idx !== index),
      }));
    } catch (error) {}
  };

  console.log(route.state);

  return (
    <>
      <div className="buttons-container">
        <button
          className="goBackBtn"
          style={{ top: "12px", left: "60px" }}
          onClick={() => {
            if (route.state?.materialCard) {
              navigate(`/CourseDetails/${route.state.courseID}`, {
                state: { courseID: route.state.courseID },
              });
            } else {
              navigate(`/ExamPage`, { state: { eid: examId } });
            }
          }}
        >
          <svg
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 1024 1024"
          >
            <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
          </svg>
          <span>Back</span>
        </button>
      </div>
      {userData.role === "Instructor" && (
        <div className="buttons-container">
          <button
            className="goBackBtn"
            style={{ top: "12px", right: "60px" }}
            onClick={() => {
              navigate(`/AddExam/${courseId}`, {
                state: {
                  activeStep: 1,
                  eid: examId,
                  mode: "editQuestion",
                  cid: courseId,
                  materialCard: true,
                },
              });
            }}
          >
            <svg
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 1024 1024"
            >
              <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
            </svg>
            <span>Add Questions</span>
          </button>
        </div>
      )}
      {userData.role === "Student" && (
        <div className="container">
          {!!exam.questions.length && (
            <h2 className="text-center text-white exam-title">
              {exam.ExamTitle}
            </h2>
          )}
          {!exam.questions.map((question, index) => (
            <div key={index} className="mx-5 my-4 px-3 py-2 exam-question">
              <h3 className="mb-3">{question.title}</h3>
              {question.answers.map((answer, idx) => (
                <div key={idx} className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={question.title}
                    value={answer}
                    id={`${question.title}-${idx}`}
                    onClick={chooseAnswerHandler}
                  />
                  <label htmlFor={`${question.title}-${idx}`}>{answer}</label>
                </div>
              ))}
            </div>
          )).length && (
            <Placeholder
              style={{ marginTop: "80px" }}
              text={`No qustions available for ${exam.ExamTitle}`}
              img={CaughtUp}
            />
          )}
          {!!exam.questions.length && (
            <div className="text-end mx-5">
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitAnswersHandler}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
      {userData.role === "Instructor" && (
        <div className="container">
          {!!exam.questions.length && (
            <h2 className="text-center text-white exam-title">
              {exam.ExamTitle}
            </h2>
          )}
          {!exam.questions.length ? (
            <Placeholder
              style={{ marginTop: "80px" }}
              text={`No qustions available for ${exam.ExamTitle}`}
              img={CaughtUp}
            />
          ) : (
            exam.questions.map((question, index) => (
              <div
                key={index}
                className="form-check mx-5 my-2 bg-body-secondary px-3 py-2"
              >
                <div className="d-flex justify-content-between align-items-center edit-question-info">
                  <div>
                    <label htmlFor={`questionTitle-${index}`} className="me-1">
                      Question title:
                    </label>
                    <input
                      id={`questionTitle-${index}`}
                      value={
                        editingIndex === index ? question.title : question.title
                      }
                      disabled={editingIndex !== index}
                      onChange={(e) =>
                        handleEditChange(index, "title", e.target.value)
                      }
                    />
                  </div>
                </div>
                {question.answers.map((answer, idx) => (
                  <div key={idx} className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={question.title}
                      value={answer}
                      id={`${question.title}-${idx}`}
                      disabled={editingIndex !== index}
                    />
                    <label htmlFor={`${question.title}-${idx}`}>
                      <input
                        type="text"
                        value={editingIndex === index ? answer : answer}
                        disabled={editingIndex !== index}
                        onChange={(e) =>
                          handleEditChange(index, idx, e.target.value)
                        }
                      />
                    </label>
                  </div>
                ))}
                <div className="d-flex justify-content-between align-items-center edit-question-info">
                  <div>
                    <label htmlFor={`correctAnswer-${index}`} className="me-1">
                      Index of Correct Answer:
                    </label>
                    <input
                      id={`correctAnswer-${index}`}
                      type="number"
                      value={
                        editingIndex === index
                          ? question.answers.indexOf(question.correctAnswer)
                          : question.answers.indexOf(question.correctAnswer)
                      }
                      disabled={editingIndex !== index}
                      min="0"
                      max="3"
                      onChange={(e) =>
                        handleEditChange(
                          index,
                          "indexOfCorrectAnswer",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => editQuestionHandler(index)}
                  >
                    {editingIndex === index ? "Save" : "Edit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => deleteQuestionHandler(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default ExamQuestions;
