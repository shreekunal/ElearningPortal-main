import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import styled from "styled-components";
import CoursePlaceHolder from "../../assets/Course_Placeholder.svg";
import {
  faUser,
  faChalkboardTeacher,
  faFileAlt,
  faClock,
  faBook,
  faQuestionCircle,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CourseDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CurrentUserContext } from "../../App";
import CourseMaterial from "../CourseMaterial/CourseMaterial";
import NotFoundImg from "../../assets/404.svg";
import Placeholder from "../Placeholder/Placeholder";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AccessDenied from "../../assets/AccessDenied.svg";
import CaughtUp from "../../assets/Grades.svg";
import Front_ENV from "../../../Front_ENV.jsx";
import { getCookie } from "../Cookie/Cookie.jsx";
import Loader from "../Loader/Loader.jsx";

const DetailsHeaderDiv = styled.div`
  position: relative;

  &::before {
    content: "";
    background-image: url(${(props) =>
      props.$image
        ? `${Front_ENV.Back_Origin}/${props.$image}`
        : CoursePlaceHolder});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.2;
  }
`;

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    showMessage,
    courses,
    fetchCourses,
    materials,
    isAuthenticated,
    confirmationToast,
    setMaterials,
  } = useContext(CurrentUserContext);
  const [loader, setLoader] = useState(true);
  const [units, setUnits] = useState([]);
  const route = useLocation();
  const course = courses.find((course) => course.id === id);

  const fetchMaterials = async () => {
    // Fetch materials for the student
    const response = await fetch(
      `${Front_ENV.Back_Origin}/getCourseMaterials/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      }
    ).then((res) => res.json());

    setTimeout(() => setLoader(false), 500);

    if (response.data) {
      setMaterials(response.data);
    } else {
      setMaterials([]);
      showMessage(response.error, true);
    }
  };

  const fetchUnits = async () => {
    // Fetch units for the course
    try {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/getCourseUnits/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: getCookie("token") || "",
          },
        }
      );

      const data = await response.json();

      if (data.data) {
        setUnits(data.data);
      } else {
        setUnits([]);
        if (data.error && data.error !== "No units found for this course") {
          showMessage(data.error, true);
        }
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    }
  };

  const fetchData = async () => {
    await fetchCourses();
    if (isAuthenticated) {
      await fetchMaterials();
      await fetchUnits();
    }
  };

  useEffect(() => {
    if (id === `undefined` || !id) {
      navigate("/Courses");
      return;
    }
    fetchData();
  }, [route]);

  const EnrollCourse = async (courseID) => {
    if (!isAuthenticated) {
      showMessage("Please Login to Enroll", true);
      navigate("/login");
      return;
    }

    const confirm = await confirmationToast(
      "Are you sure you want to enroll in this course?"
    );
    if (confirm) {
      setLoader(true);
      const response = await fetch(`${Front_ENV.Back_Origin}/enroll-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          courseId: courseID,
          duration: course.hours,
        }),
      }).then((response) => response.json());
      setLoader(false);
      if (response.error) {
        showMessage(response.error, true);
      } else {
        fetchCourses();
        showMessage(response.message, false);
      }
    }
  };

  const AddMaterial = () => {
    navigate(`/AddMaterial/${course.id}`);
  };
  const AssignInstructor = async (courseId) => {
    setLoader(true);
    const response = await fetch(
      `${Front_ENV.Back_Origin}/getUsers?role=Instructor`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      }
    ).then((response) => response.json());
    setLoader(false);
    navigate(`/AssignInstructor/${courseId}`, {
      state: { instructorsList: response.data, assignInstructor: true },
    });
  };
  const StudentsList = async () => {
    setLoader(true);
    const params = new URLSearchParams({
      courseId: id,
      type: "students",
    });
    const response = await fetch(
      `${Front_ENV.Back_Origin}/getCourseUsersList?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      }
    ).then((response) => response.json());
    setLoader(false);
    navigate(`/CourseDetails/${id}/StudentsList`, {
      state: { studentsList: response.data },
    });
  };

  const InstructorsList = async () => {
    setLoader(true);
    const params = new URLSearchParams({
      courseId: id,
      type: "instructors",
    });
    const response = await fetch(
      `${Front_ENV.Back_Origin}/getCourseUsersList?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      }
    ).then((response) => response.json());
    setLoader(false);
    navigate(`/CourseDetails/${id}/InstructorsList`, {
      state: { instructorsList: response.data },
    });
  };

  return course ? (
    <>
      <div className="buttons-container">
        {currentUser.role === "Instructor" && course.isEnrolled && (
          <div className="add-material-button-container">
            <button className="AddButton add-material" onClick={AddMaterial}>
              <FontAwesomeIcon icon={faPlus} title="Add Course" />
              Add Material
            </button>
          </div>
        )}
      </div>
      <div className="card course-details card-shadow">
        {/* check if instructor is teaching this course */}
        <DetailsHeaderDiv
          className="card-header details-header"
          $image={course.image ? course.image.replaceAll("\\", "/") : ""}
        >
          <div className="course-header-content">
            <div className="course-main-info">
              <div className="course-category-badge">
                <span>Technology</span>
              </div>
              <h3 className="course-title alignLeft-text bold-text">
                {course.title}
              </h3>
              <h5 className="course-description">{course.desc}</h5>

              <div className="course-stats-interactive">
                <div className="stats-card">
                  <FontAwesomeIcon icon={faClock} />
                  <span className="stats-number">{course.hours}</span>
                  <span className="stats-label">Hours</span>
                </div>

                <div
                  className={
                    course.isEnrolled || currentUser.role === "Admin"
                      ? "stats-card clickable"
                      : "stats-card"
                  }
                  onClick={
                    course.isEnrolled || currentUser.role === "Admin"
                      ? StudentsList
                      : null
                  }
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span className="stats-number">{course.numStudents}</span>
                  <span className="stats-label">Students</span>
                </div>

                <div className="stats-card">
                  <FontAwesomeIcon icon={faFileAlt} />
                  <span className="stats-number">{units.length}</span>
                  <span className="stats-label">Units</span>
                </div>
              </div>
            </div>

            <div className="enrollment-card">
              <div className="price-section">
                <span className="current-price">Free</span>
                <span className="original-price">$99</span>
                <span className="discount-badge">100% OFF</span>
              </div>

              <div className="enrollment-actions">
                {currentUser.role === "Student" || !currentUser.role ? (
                  !course.isEnrolled ? (
                    <button
                      className="enroll-button-primary"
                      onClick={() => EnrollCourse(course.id)}
                    >
                      <span>Enroll Now</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 12h14M12 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  ) : (
                    <div className="enrolled-status">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      <span>Enrolled</span>
                    </div>
                  )
                ) : null}

                {currentUser.role === "Admin" && (
                  <button
                    className="admin-action-button"
                    onClick={() => AssignInstructor(course.id)}
                  >
                    <FontAwesomeIcon icon={faChalkboardTeacher} />
                    Assign Instructor
                  </button>
                )}

                <div className="course-features">
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M12 6v6l4 2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>Lifetime Access</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>Q&A Support</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>Certificate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DetailsHeaderDiv>
        {currentUser.role &&
          (course.isEnrolled || currentUser.role.toLowerCase() === "admin") && (
            <>
              {/* Learning Units Section */}
              <div
                className="course-units card-body"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "0 0 16px 16px",
                  padding: "32px",
                  marginTop: "5px",
                  color: "white",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "24px",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faBook}
                      style={{ fontSize: "24px" }}
                    />
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "28px",
                        fontWeight: "700",
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      Learning Units
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        opacity: 0.9,
                        fontSize: "16px",
                      }}
                    >
                      {units.length} {units.length === 1 ? "unit" : "units"}{" "}
                      available
                    </p>
                  </div>
                </div>

                {loader ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "40px 0",
                    }}
                  >
                    <Loader />
                  </div>
                ) : units.length ? (
                  <div
                    className="units-grid"
                    style={{
                      display: "grid",
                      gap: "20px",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(350px, 1fr))",
                    }}
                  >
                    {units.map((unit, index) => (
                      <div
                        key={unit.id}
                        className="unit-card-modern"
                        onClick={() =>
                          navigate(`/Unit/${unit.id}`, {
                            state: { courseID: course.id },
                          })
                        }
                        style={{
                          background: "rgba(255,255,255,0.95)",
                          borderRadius: "16px",
                          padding: "24px",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          backdropFilter: "blur(10px)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-8px) scale(1.02)";
                          e.currentTarget.style.boxShadow =
                            "0 20px 40px rgba(0,0,0,0.15)";
                          e.currentTarget.style.background =
                            "rgba(255,255,255,1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 25px rgba(0,0,0,0.1)";
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.95)";
                        }}
                      >
                        {/* Unit Number Badge */}
                        <div
                          style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            background:
                              "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                            color: "white",
                            borderRadius: "20px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          Unit {index + 1}
                        </div>

                        {/* Main Content */}
                        <div style={{ paddingRight: "60px" }}>
                          <h4
                            style={{
                              margin: "0 0 16px 0",
                              color: "#2D3748",
                              fontWeight: "700",
                              fontSize: "20px",
                              lineHeight: "1.3",
                            }}
                          >
                            {unit.title}
                          </h4>

                          {/* Stats Row */}
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              marginBottom: "16px",
                              flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background:
                                  "linear-gradient(45deg, #667eea, #764ba2)",
                                color: "white",
                                padding: "8px 12px",
                                borderRadius: "20px",
                                fontSize: "14px",
                                fontWeight: "500",
                                boxShadow:
                                  "0 4px 12px rgba(102, 126, 234, 0.3)",
                              }}
                            >
                              <FontAwesomeIcon icon={faBook} />
                              <span>{unit.chaptersCount} chapters</span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background:
                                  "linear-gradient(45deg, #FF6B6B, #FF8E53)",
                                color: "white",
                                padding: "8px 12px",
                                borderRadius: "20px",
                                fontSize: "14px",
                                fontWeight: "500",
                                boxShadow:
                                  "0 4px 12px rgba(255, 107, 107, 0.3)",
                              }}
                            >
                              <FontAwesomeIcon icon={faQuestionCircle} />
                              <span>{unit.questionsCount} quiz questions</span>
                            </div>
                          </div>

                          {/* Created Date */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              color: "#718096",
                              fontSize: "13px",
                              marginBottom: "16px",
                            }}
                          >
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>
                              Created:{" "}
                              {new Date(unit.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Decorative Background Pattern */}
                        <div
                          style={{
                            position: "absolute",
                            top: "-50px",
                            right: "-50px",
                            width: "100px",
                            height: "100px",
                            background:
                              "linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                            borderRadius: "50%",
                            zIndex: 0,
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      border: "2px dashed rgba(255,255,255,0.3)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "48px",
                        marginBottom: "16px",
                        color: "white",
                      }}
                    >
                      <FontAwesomeIcon icon={faBook} />
                    </div>
                    <h4
                      style={{
                        color: "white",
                        margin: "0 0 8px 0",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      No Learning Units Yet
                    </h4>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        margin: 0,
                        fontSize: "16px",
                      }}
                    >
                      Learning units will appear here once they are created by
                      instructors
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
      </div>
    </>
  ) : (
    <Placeholder text="Course Not Found" img={NotFoundImg} />
  );
};

export default CourseDetails;
