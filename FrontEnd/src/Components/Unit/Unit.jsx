import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../App";
import { getCookie } from "../Cookie/Cookie.jsx";
import Front_ENV from "../../../Front_ENV.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faQuestionCircle,
  faChevronDown,
  faChevronRight,
  faLayerGroup,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./Unit.css";
import Loader from "../Loader/Loader";

const Unit = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showMessage, currentUser } = useContext(CurrentUserContext);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  const courseId = location.state?.courseID;

  const fetchUnit = async () => {
    try {
      const response = await fetch(`${Front_ENV.Back_Origin}/getUnit/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("token") || "",
        },
      });

      const data = await response.json();

      if (data.data) {
        setUnit(data.data);
      } else {
        showMessage(data.error || "Failed to load unit", true);
      }
    } catch (error) {
      showMessage("Error loading unit", true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnit();
  }, [id]);

  const toggleChapter = (chapterIndex) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex],
    }));
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const submitQuiz = () => {
    if (!unit?.quiz?.questions) return;

    const results = unit.quiz.questions.map((question, index) => {
      const selectedAnswer = selectedAnswers[index];
      const isCorrect = selectedAnswer === question.correctOptionIndex;

      return {
        question: question.question,
        selectedAnswer:
          selectedAnswer !== undefined
            ? question.options[selectedAnswer]
            : "Not answered",
        correctAnswer: question.options[question.correctOptionIndex],
        isCorrect,
      };
    });

    const score = results.filter((result) => result.isCorrect).length;
    const percentage = Math.round((score / unit.quiz.questions.length) * 100);

    setQuizResults({
      results,
      score,
      total: unit.quiz.questions.length,
      percentage,
    });
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  };

  if (loading) return <Loader />;

  if (!unit) {
    return (
      <div className="unit-error">
        <h3>Unit not found</h3>
        <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="unit-container">
      <div className="unit-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Course
        </button>
        <div className="unit-title-section">
          <FontAwesomeIcon icon={faLayerGroup} className="unit-icon" />
          <h1>{unit.title}</h1>
        </div>
      </div>

      <div className="unit-content">
        {/* Chapters Section */}
        <div className="chapters-section">
          <div className="section-header">
            <FontAwesomeIcon icon={faBook} />
            <h2>Chapters ({unit.chapters?.length || 0})</h2>
          </div>

          {unit.chapters?.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="chapter-card">
              <div
                className="chapter-header"
                onClick={() => toggleChapter(chapterIndex)}
              >
                <FontAwesomeIcon
                  icon={
                    expandedChapters[chapterIndex]
                      ? faChevronDown
                      : faChevronRight
                  }
                  className="chapter-toggle"
                />
                <h3>{chapter.title}</h3>
              </div>

              {expandedChapters[chapterIndex] && (
                <div className="chapter-content">
                  {chapter.sections?.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="section-card">
                      <h4>{section.title}</h4>
                      <p>{section.content}</p>

                      {section.subsections?.map(
                        (subsection, subsectionIndex) => (
                          <div
                            key={subsectionIndex}
                            className="subsection-card"
                          >
                            <h5>{subsection.title}</h5>
                            <p>{subsection.content}</p>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quiz Section */}
        {unit.quiz?.questions?.length > 0 && (
          <div className="quiz-section">
            <div className="section-header">
              <FontAwesomeIcon icon={faQuestionCircle} />
              <h2>Unit Quiz ({unit.quiz.questions.length} questions)</h2>
              {!showQuiz && (
                <button
                  className="start-quiz-btn"
                  onClick={() => setShowQuiz(true)}
                >
                  Start Quiz
                </button>
              )}
            </div>

            {showQuiz && (
              <div className="quiz-content">
                {!quizSubmitted ? (
                  <>
                    {unit.quiz.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="question-card">
                        <h4>
                          Question {questionIndex + 1}: {question.question}
                        </h4>
                        <div className="options-container">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="option-label">
                              <input
                                type="radio"
                                name={`question-${questionIndex}`}
                                value={optionIndex}
                                checked={
                                  selectedAnswers[questionIndex] === optionIndex
                                }
                                onChange={() =>
                                  handleAnswerSelect(questionIndex, optionIndex)
                                }
                              />
                              <span className="option-text">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="quiz-actions">
                      <button
                        className="submit-quiz-btn"
                        onClick={submitQuiz}
                        disabled={
                          Object.keys(selectedAnswers).length <
                          unit.quiz.questions.length
                        }
                      >
                        Submit Quiz
                      </button>
                      <button
                        className="cancel-quiz-btn"
                        onClick={() => setShowQuiz(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="quiz-results">
                    <div className="results-header">
                      <h3>Quiz Results</h3>
                      <div className="score-display">
                        <span className="score">
                          {quizResults.score}/{quizResults.total}
                        </span>
                        <span className="percentage">
                          ({quizResults.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="results-details">
                      {quizResults.results.map((result, index) => (
                        <div
                          key={index}
                          className={`result-item ${
                            result.isCorrect ? "correct" : "incorrect"
                          }`}
                        >
                          <h4>
                            Question {index + 1}: {result.question}
                          </h4>
                          <p>
                            <strong>Your answer:</strong>{" "}
                            {result.selectedAnswer}
                          </p>
                          <p>
                            <strong>Correct answer:</strong>{" "}
                            {result.correctAnswer}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="quiz-actions">
                      <button className="retake-quiz-btn" onClick={resetQuiz}>
                        Retake Quiz
                      </button>
                      <button
                        className="close-quiz-btn"
                        onClick={() => setShowQuiz(false)}
                      >
                        Close Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Unit;
