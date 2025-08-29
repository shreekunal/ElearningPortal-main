import { useContext } from "react";
import { CurrentUserContext } from "../../App.jsx";
import { useNavigate } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CourseCard.css";
import Front_ENV from "../../../Front_ENV.jsx";
import CoursePlaceHolder from "../../assets/Course_Placeholder.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getCookie } from "../Cookie/Cookie.jsx";

const CourseCard = ({
  id,
  title,
  desc,
  hours,
  image,
  isEnrolled,
  mode,
  setCourseEdit,
  showEditFormHandler,
  refreshCourses,
}) => {
  const navigate = useNavigate();
  const { currentUser, showMessage, confirmationToast } =
    useContext(CurrentUserContext);
  const enrolled = mode ? true : isEnrolled;

  const CourseDetails = () => {
    // If it's MyCourses mode and user is enrolled, go to course blog
    if (mode === "MyCourses" && enrolled) {
      navigate(`/CourseBlog/${id}`);
    } else {
      navigate(`/CourseDetails/${id}`);
    }
  };

  const handleEditCourse = () => {
    setCourseEdit({ id, title, desc, hours, image });
    showEditFormHandler();
  };

  const handleDeleteCourse = async () => {
    const isConfirmed = await confirmationToast(
      `Are you sure you want to delete the course "${title}"? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/delete-course/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: getCookie("token") || "",
          },
        }
      ).then((response) => response.json());

      if (response.error) {
        showMessage(response.error, true);
      } else {
        showMessage(response.message, false);
        // Refresh the courses list if the function is provided
        if (refreshCourses) {
          refreshCourses();
        }
      }
    } catch (error) {
      showMessage("An error occurred while deleting the course.", true);
    }
  };

  // Simplified Course Card with hardcoded details and Start Learning button
  return (
    <div className="card course-card card-shadow" key={id}>
      <div className="card-header course-card-header-img">
        <img src={image ? `${image}` : CoursePlaceHolder} alt="Course" />
        <div className="card-overlay"></div>
        <div className="course-badge">
          <span>Popular</span>
        </div>
      </div>
      <div className="card-body">
        <h5 className="pascalCase-text bold-text course-title">{title}</h5>

        {/* Enhanced Start Learning Button */}
        <div className="start-learning-container">
          {enrolled ? (
            <button
              className="start-learning-button enhanced"
              onClick={CourseDetails}
            >
              Continue Learning
            </button>
          ) : (
            <button
              className="enroll-button-new enhanced"
              onClick={CourseDetails}
            >
              View Details
            </button>
          )}
        </div>

        {/* Admin Actions */}
        {currentUser.role === "Admin" && (
          <div className="admin-actions">
            <button
              className="admin-btn edit-btn"
              onClick={handleEditCourse}
              title="Edit Course"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="admin-btn delete-btn"
              onClick={handleDeleteCourse}
              title="Delete Course"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}

        {/* Progress Bar moved below button - Hidden for Admin and Instructor */}
        {currentUser.role === "Student" && (
          <div className="course-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: enrolled ? "65%" : "0%" }}
              ></div>
            </div>
            <span className="progress-text">
              {enrolled ? "65% Complete" : "Not Started"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
