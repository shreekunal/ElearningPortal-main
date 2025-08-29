import { useContext } from "react";
import { CurrentUserContext } from "../../App.jsx";
import { useNavigate } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CourseCard.css";
import Front_ENV from "../../../Front_ENV.jsx";
import CoursePlaceHolder from "../../assets/Course_Placeholder.svg";

const CourseCard = ({ id, title, image, isEnrolled, mode }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);
  const enrolled = mode ? true : isEnrolled;

  const CourseDetails = () => {
    // If it's MyCourses mode and user is enrolled, go to course blog
    if (mode === "MyCourses" && enrolled) {
      navigate(`/CourseBlog/${id}`);
    } else {
      navigate(`/CourseDetails/${id}`);
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

        {/* Progress Bar moved below button */}
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
      </div>
    </div>
  );
};

export default CourseCard;
