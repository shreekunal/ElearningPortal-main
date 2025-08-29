import { useContext } from "react";
import { useNavigate } from "react-router";
import Instructor from "../../assets/Instructor.svg";
import Teachers from "../../assets/Teachers.svg";
import { CurrentUserContext } from "../../App";
import Front_ENV from "../../../Front_ENV.jsx";
import { getCookie } from "../Cookie/Cookie.jsx";
import "./AdminInstructorsPage.css";

const InstructorsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);

  const InstructorsList = async () => {
    try {
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

      if (response.error) {
        console.error("Error fetching instructors:", response.error);
        return;
      }

      navigate(`/CurrentInstructors`, {
        state: { instructorsList: response.data, isAdmin: true },
      });
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
    }
  };

  const AddInstructor = () => {
    navigate("/AddInstructor");
  };

  return (
    <div className="instructors-page-container">
      <div className="instructors-header">
        <h1>Instructor Management</h1>
        <p>
          Manage instructors, track performance, and oversee course assignments
        </p>
      </div>

      <div className="instructors-main-content">
        {/* Main Action Cards */}
        <div className="instructors-cards-container">
          <div
            className="instructor-action-card current-instructors-card"
            onClick={InstructorsList}
          >
            <div className="card-icon-container">
              <img
                src={Teachers}
                alt="Current Instructors"
                className="card-icon"
              />
            </div>
            <h3 className="card-title">Current Instructors</h3>
            <p className="card-description">
              View and manage all registered instructors, their courses, and
              performance metrics
            </p>
            <button className="card-action-button">View All Instructors</button>
          </div>

          <div
            className="instructor-action-card new-instructor-card"
            onClick={AddInstructor}
          >
            <div className="card-icon-container">
              <img
                src={Instructor}
                alt="Add Instructor"
                className="card-icon"
              />
            </div>
            <h3 className="card-title">Add New Instructor</h3>
            <p className="card-description">
              Register new instructors and set up their profiles with course
              assignments
            </p>
            <button className="card-action-button">Add Instructor</button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="floating-action-button"
        onClick={AddInstructor}
        title="Quick Add Instructor"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </button>
    </div>
  );
};

export default InstructorsPage;
