import { Button, Box } from "@mui/material";
import { useContext, useState, useEffect, useRef } from "react";
import Question from "../Question/Question";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { CurrentUserContext } from "../../App";
import { getCookie } from "../Cookie/Cookie.jsx";
import "./AddExam.css";
import Front_ENV from "../../../Front_ENV.jsx";
import question from "../Question/Question";

let questionsList = {
  examTitle: "",
  questions: [],
  questionsCount: 1,
};

const AddQuestions = ({ id, examTitle }) => {
  const route = useLocation();
  let alternativeExamTitle = route.state?.eid;
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { courses, showMessage } = useContext(CurrentUserContext);
  const currentCourse = courses.find((course) => course.id === id);
  const [formData, setFormData] = useState({
    title: "",
    answers: ["", "", "", ""],
    indexOfCorrectAnswer: "0",
  });

  useEffect(() => {
    if (alternativeExamTitle) {
      questionsList.examTitle = alternativeExamTitle;
    } else {
      questionsList.examTitle = examTitle;
    }
  }, []);

  const areChoicesUnique = (choice1, choice2, choice3, choice4) => {
    const choices = [choice1, choice2, choice3, choice4];
    const uniqueChoices = new Set(choices);
    return uniqueChoices.size === choices.length;
  };

  const handleAddQuestion = (formData) => {
    if (
      formData.title &&
      formData.answers[0] &&
      formData.answers[1] &&
      formData.answers[2] &&
      formData.answers[3] &&
      formData.indexOfCorrectAnswer
    ) {
      const allUnique = areChoicesUnique(
        formData.answers[0],
        formData.answers[1],
        formData.answers[2],
        formData.answers[3]
      );
      if (!allUnique) {
        showMessage("Choices Are Not Unique", true);
        return false;
      } else {
        questionsList.questions.push(formData);
        questionsList.questionsCount++;
        setFormData("");
        return true;
      }
    } else {
      formRef.current.reportValidity();
      return false;
    }
  };
  const handleSubmit = (formData) => {
    if (handleAddQuestion(formData)) {
      fetch(`${Front_ENV.Back_Origin}/addQuestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token"),
        },
        body: JSON.stringify(questionsList),
      })
        .then((response) => {
          return response.json().then((data) => {
            if (response.status === 201) {
              showMessage(data.message, false);
              navigate(`/CourseDetails/${id}`);
              return data;
            } else {
              showMessage(data.error, true);
              throw new Error("Failed to create exam");
            }
          });
        })
        .catch((error) => {
          showMessage(error.message, true);
        });
    }
  };

  return (
    <>
      <Box sx={{ width: "80%", margin: "0 auto 80px" }}>
        <h4 className="mb-4">Add Questions</h4>
        <form onSubmit={handleSubmit} className="mb-4" ref={formRef}>
          <Question
            formData={formData}
            setFormData={setFormData}
            questionCount={questionsList.questionsCount}
          />
        </form>
        <button
          className="add-question-button AddButton"
          onClick={() => handleAddQuestion(formData)}
        >
          <FontAwesomeIcon icon={faPlus} title="Add Question" />
          Another Question
        </button>
        <Button
          variant="contained"
          className="stepper-button pascalCase-text"
          onClick={() => handleSubmit(formData)}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default AddQuestions;
