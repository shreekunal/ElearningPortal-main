import { useState, useContext } from "react";
import { CurrentUserContext } from "../../App";
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faBook,
  faQuestionCircle,
  faPlus,
  faTrash,
  faSave,
  faArrowLeft,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import "./CreateUnit.css";
import Front_ENV from "../../../Front_ENV.jsx";
import { getCookie } from "../Cookie/Cookie.jsx";

const CreateUnit = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser, showMessage } = useContext(CurrentUserContext);

  const [unit, setUnit] = useState({
    title: "",
    chapters: [
      {
        id: 1,
        title: "",
        sections: [
          {
            id: 1,
            heading: "",
            content: "",
            subSections: [
              {
                id: 1,
                subHeading: "",
                subContent: "",
              },
            ],
          },
        ],
        videoUrl: "",
        materials: "",
      },
    ],
    quiz: {
      title: "",
      questions: [
        {
          id: 1,
          question: "",
          type: "multiple-choice",
          options: ["", ""],
          correctAnswer: 0,
        },
      ],
    },
  });

  const addChapter = () => {
    const newChapter = {
      id: unit.chapters.length + 1,
      title: "",
      sections: [
        {
          id: 1,
          heading: "",
          content: "",
          subSections: [
            {
              id: 1,
              subHeading: "",
              subContent: "",
            },
          ],
        },
      ],
      videoUrl: "",
      materials: "",
    };
    setUnit({
      ...unit,
      chapters: [...unit.chapters, newChapter],
    });
  };

  const removeChapter = (chapterId) => {
    if (unit.chapters.length > 1) {
      setUnit({
        ...unit,
        chapters: unit.chapters.filter((chapter) => chapter.id !== chapterId),
      });
    }
  };

  const updateChapter = (chapterId, field, value) => {
    setUnit({
      ...unit,
      chapters: unit.chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, [field]: value } : chapter
      ),
    });
  };

  const addSection = (chapterId) => {
    setUnit({
      ...unit,
      chapters: unit.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              sections: [
                ...chapter.sections,
                {
                  id: chapter.sections.length + 1,
                  heading: "",
                  content: "",
                  subSections: [
                    {
                      id: 1,
                      subHeading: "",
                      subContent: "",
                    },
                  ],
                },
              ],
            }
          : chapter
      ),
    });
  };

  const removeSection = (chapterId, sectionId) => {
    setUnit({
      ...unit,
      chapters: unit.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              sections: chapter.sections.filter(
                (section) => section.id !== sectionId
              ),
            }
          : chapter
      ),
    });
  };

  const updateSection = (chapterId, sectionId, field, value) => {
    setUnit({
      ...unit,
      chapters: unit.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              sections: chapter.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, [field]: value }
                  : section
              ),
            }
          : chapter
      ),
    });
  };

  const addSubSection = (chapterId, sectionId) => {
    setUnit({
      ...unit,
      chapters: unit.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              sections: chapter.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      subSections: [
                        ...section.subSections,
                        {
                          id: section.subSections.length + 1,
                          subHeading: "",
                          subContent: "",
                        },
                      ],
                    }
                  : section
              ),
            }
          : chapter
      ),
    });
  };

  const removeSubSection = (chapterId, sectionId, subSectionId) => {
    setUnit({
      ...unit,
      chapters: unit.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              sections: chapter.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      subSections: section.subSections.filter(
                        (subSection) => subSection.id !== subSectionId
                      ),
                    }
                  : section
              ),
            }
          : chapter
      ),
    });
  };

  const updateSubSection = (
    chapterId,
    sectionId,
    subSectionId,
    field,
    value
  ) => {
    setUnit({
      ...unit,
      chapters: unit.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              sections: chapter.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      subSections: section.subSections.map((subSection) =>
                        subSection.id === subSectionId
                          ? { ...subSection, [field]: value }
                          : subSection
                      ),
                    }
                  : section
              ),
            }
          : chapter
      ),
    });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: unit.quiz.questions.length + 1,
      question: "",
      type: "multiple-choice",
      options: ["", ""],
      correctAnswer: 0,
    };
    setUnit({
      ...unit,
      quiz: {
        ...unit.quiz,
        questions: [...unit.quiz.questions, newQuestion],
      },
    });
  };

  const removeQuestion = (questionId) => {
    if (unit.quiz.questions.length > 1) {
      setUnit({
        ...unit,
        quiz: {
          ...unit.quiz,
          questions: unit.quiz.questions.filter((q) => q.id !== questionId),
        },
      });
    }
  };

  const updateQuestion = (questionId, field, value) => {
    setUnit({
      ...unit,
      quiz: {
        ...unit.quiz,
        questions: unit.quiz.questions.map((q) =>
          q.id === questionId ? { ...q, [field]: value } : q
        ),
      },
    });
  };

  const updateQuestionOption = (questionId, optionIndex, value) => {
    setUnit({
      ...unit,
      quiz: {
        ...unit.quiz,
        questions: unit.quiz.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((option, index) =>
                  index === optionIndex ? value : option
                ),
              }
            : q
        ),
      },
    });
  };

  const addQuestionOption = (questionId) => {
    setUnit({
      ...unit,
      quiz: {
        ...unit.quiz,
        questions: unit.quiz.questions.map((q) =>
          q.id === questionId && q.options.length < 4
            ? {
                ...q,
                options: [...q.options, ""],
              }
            : q
        ),
      },
    });
  };

  const removeQuestionOption = (questionId, optionIndex) => {
    setUnit({
      ...unit,
      quiz: {
        ...unit.quiz,
        questions: unit.quiz.questions.map((q) =>
          q.id === questionId && q.options.length > 2
            ? {
                ...q,
                options: q.options.filter((_, index) => index !== optionIndex),
                correctAnswer:
                  q.correctAnswer >= optionIndex && q.correctAnswer > 0
                    ? q.correctAnswer - 1
                    : q.correctAnswer >= optionIndex
                    ? 0
                    : q.correctAnswer,
              }
            : q
        ),
      },
    });
  };

  const handleSaveUnit = async () => {
    if (!unit.title.trim()) {
      showMessage("Please provide a unit title", true);
      return;
    }

    if (unit.chapters.some((chapter) => !chapter.title.trim())) {
      showMessage("Please provide titles for all chapters", true);
      return;
    }

    if (
      unit.chapters.some((chapter) =>
        chapter.sections.some((section) => !section.heading.trim())
      )
    ) {
      showMessage("Please provide headings for all sections", true);
      return;
    }

    if (!unit.quiz.title.trim()) {
      showMessage("Please provide a quiz title", true);
      return;
    }

    if (unit.quiz.questions.some((q) => !q.question.trim())) {
      showMessage("Please provide questions for all quiz items", true);
      return;
    }

    try {
      const token = getCookie("token");
      if (!token) {
        showMessage("Please log in to create a unit", true);
        return;
      }

      const response = await fetch(
        `${Front_ENV.Back_Origin}/createUnit/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            title: unit.title,
            chapters: unit.chapters,
            quiz: unit.quiz,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        showMessage(data.error, true);
        return;
      }

      showMessage(
        data.message ||
          "Unit created successfully and made available to all enrolled students!",
        false
      );
      navigate(`/CourseDetails/${courseId}`);
    } catch (error) {
      console.error("Error creating unit:", error);
      showMessage("Error creating unit. Please try again.", true);
    }
  };

  return (
    <div className="create-unit-container">
      <div className="create-unit-header">
        <div className="header-content">
          <h1 className="page-title" style={{ color: "#ffffff" }}>
            <FontAwesomeIcon icon={faLayerGroup} className="title-icon" />
            Create Learning Unit
          </h1>
        </div>
      </div>

      <div className="unit-form">
        {/* Unit Basic Info */}
        <div className="form-section unit-info-section">
          <h2 className="section-title" style={{ color: "#ffffff" }}>
            <FontAwesomeIcon icon={faEdit} style={{ color: "#ffffff" }} />
            Unit Information
          </h2>
          <div className="form-group">
            <label htmlFor="unitTitle"></label>
            <input
              type="text"
              id="unitTitle"
              value={unit.title}
              onChange={(e) => setUnit({ ...unit, title: e.target.value })}
              placeholder="Enter unit title (e.g., Introduction to Computer Networks)"
            />
          </div>
        </div>

        {/* Chapters Section */}
        <div className="form-section chapters-section">
          <div className="section-header">
            <h2 className="section-title" style={{ color: "#ffffff" }}>
              <FontAwesomeIcon icon={faBook} style={{ color: "#ffffff" }} />
              Chapters ({unit.chapters.length})
            </h2>
            <button
              onClick={addChapter}
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #ccc",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Chapter
            </button>
          </div>

          {unit.chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id} className="chapter-card">
              <div className="chapter-header">
                <span className="chapter-number">
                  Chapter {chapterIndex + 1}
                </span>
                {unit.chapters.length > 1 && (
                  <button
                    className="remove-button"
                    onClick={() => removeChapter(chapter.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
              <div className="chapter-form">
                <div className="form-group">
                  <label>Chapter Title *</label>
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) =>
                      updateChapter(chapter.id, "title", e.target.value)
                    }
                    placeholder="Enter chapter title"
                  />
                </div>

                {/* Sections */}
                <div className="sections-container">
                  <div className="subsection-header">
                    <h4>Content Sections</h4>
                    <button
                      type="button"
                      className="add-subsection-button"
                      onClick={() => addSection(chapter.id)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Add Section
                    </button>
                  </div>

                  {chapter.sections.map((section, sectionIndex) => (
                    <div key={section.id} className="section-card">
                      <div className="section-header-mini">
                        <span className="section-label">
                          Section {sectionIndex + 1}
                        </span>
                        {chapter.sections.length > 1 && (
                          <button
                            className="remove-subsection-button"
                            onClick={() =>
                              removeSection(chapter.id, section.id)
                            }
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Heading *</label>
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) =>
                            updateSection(
                              chapter.id,
                              section.id,
                              "heading",
                              e.target.value
                            )
                          }
                          placeholder="Enter section heading"
                        />
                      </div>

                      <div className="form-group">
                        <label>Content</label>
                        <textarea
                          value={section.content}
                          onChange={(e) =>
                            updateSection(
                              chapter.id,
                              section.id,
                              "content",
                              e.target.value
                            )
                          }
                          placeholder="Enter section content"
                          rows="3"
                        />
                      </div>

                      {/* Sub-sections */}
                      <div className="subsections-container">
                        <div className="subsection-header">
                          <h5>Sub-sections</h5>
                          <button
                            type="button"
                            className="add-subsection-button small"
                            onClick={() =>
                              addSubSection(chapter.id, section.id)
                            }
                          >
                            <FontAwesomeIcon icon={faPlus} />
                            Add Sub-section
                          </button>
                        </div>

                        {section.subSections.map((subSection, subIndex) => (
                          <div key={subSection.id} className="subsection-card">
                            <div className="subsection-header-mini">
                              <span className="subsection-label">
                                Sub-section {subIndex + 1}
                              </span>
                              {section.subSections.length > 1 && (
                                <button
                                  className="remove-subsection-button small"
                                  onClick={() =>
                                    removeSubSection(
                                      chapter.id,
                                      section.id,
                                      subSection.id
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              )}
                            </div>

                            <div className="form-group">
                              <label>Sub-heading</label>
                              <input
                                type="text"
                                value={subSection.subHeading}
                                onChange={(e) =>
                                  updateSubSection(
                                    chapter.id,
                                    section.id,
                                    subSection.id,
                                    "subHeading",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter sub-heading"
                              />
                            </div>

                            <div className="form-group">
                              <label>Sub-content</label>
                              <textarea
                                value={subSection.subContent}
                                onChange={(e) =>
                                  updateSubSection(
                                    chapter.id,
                                    section.id,
                                    subSection.id,
                                    "subContent",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter sub-content"
                                rows="2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Video URL (Optional)</label>
                    <input
                      type="url"
                      value={chapter.videoUrl}
                      onChange={(e) =>
                        updateChapter(chapter.id, "videoUrl", e.target.value)
                      }
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Reading Materials (Optional)</label>
                    <input
                      type="text"
                      value={chapter.materials}
                      onChange={(e) =>
                        updateChapter(chapter.id, "materials", e.target.value)
                      }
                      placeholder="Additional resources or materials"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Section */}
        <div className="form-section quiz-section">
          <div className="section-header">
            <h2 className="section-title" style={{ color: "#ffffff" }}>
              <FontAwesomeIcon
                icon={faQuestionCircle}
                style={{ color: "#ffffff" }}
              />
              Unit Quiz ({unit.quiz.questions.length} questions)
            </h2>
            <button
              onClick={addQuestion}
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #ccc",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Question
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="quizTitle">Quiz Title *</label>
            <input
              type="text"
              id="quizTitle"
              value={unit.quiz.title}
              onChange={(e) =>
                setUnit({
                  ...unit,
                  quiz: { ...unit.quiz, title: e.target.value },
                })
              }
              placeholder="Enter quiz title"
            />
          </div>

          {unit.quiz.questions.map((question, index) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                {unit.quiz.questions.length > 1 && (
                  <button
                    className="remove-button"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
              <div className="question-form">
                <div className="form-group">
                  <label>Question *</label>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, "question", e.target.value)
                    }
                    placeholder="Enter your question"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <div className="options-header">
                    <label>Answer Options</label>
                    <div className="options-controls">
                      <button
                        type="button"
                        className="add-option-button"
                        onClick={() => addQuestionOption(question.id)}
                        disabled={question.options.length >= 4}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Option
                      </button>
                      <span className="options-count">
                        {question.options.length}/4 options
                      </span>
                    </div>
                  </div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-row">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() =>
                          updateQuestion(
                            question.id,
                            "correctAnswer",
                            optionIndex
                          )
                        }
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          updateQuestionOption(
                            question.id,
                            optionIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          className="remove-option-button"
                          onClick={() =>
                            removeQuestionOption(question.id, optionIndex)
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            className="cancel-button"
            onClick={() => navigate(`/AddMaterial/${courseId}`)}
          >
            Cancel
          </button>
          <button className="save-button" onClick={handleSaveUnit}>
            <FontAwesomeIcon icon={faSave} />
            Create Unit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUnit;
