import { useContext } from "react";
import { useNavigate } from "react-router";
import Student from "../../assets/Student.svg";
import Students from "../../assets/Grades.svg";
import { CurrentUserContext } from "../../App";
import Front_ENV from "../../../Front_ENV.jsx";
import { getCookie } from "../Cookie/Cookie.jsx";
import "./AdminStudentsPage.css";

const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);

  const StudentsList = async () => {
    try {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/getUsers?role=Student`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: getCookie("token") || "",
          },
        }
      ).then((response) => response.json());

      if (response.error) {
        console.error("Error fetching students:", response.error);
        return;
      }

      navigate(`/CurrentStudents`, {
        state: { studentsList: response.data, isAdmin: true },
      });
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const AddStudent = () => {
    navigate("/AddStudent");
  };

  return (
    <div className="students-page-container">
      <div className="students-header">
        <h1>Student Management</h1>
        <p>
          Manage students, track performance, and oversee course enrollments
        </p>
      </div>

      <div className="students-main-content">
        {/* Main Action Cards */}
        <div className="students-cards-container">
          <div
            className="student-action-card current-students-card"
            onClick={StudentsList}
          >
            <div className="card-icon-container">
              <img
                src={Students}
                alt="Current Students"
                className="card-icon"
              />
            </div>
            <h3 className="card-title">Current Students</h3>
            <p className="card-description">
              View and manage all registered students, their courses, and
              performance metrics
            </p>
            <button className="card-action-button">View All Students</button>
          </div>

          <div
            className="student-action-card new-student-card"
            onClick={AddStudent}
          >
            <div className="card-icon-container">
              <img src={Student} alt="Add Student" className="card-icon" />
            </div>
            <h3 className="card-title">Add New Student</h3>
            <p className="card-description">
              Register new students and set up their profiles with course
              enrollments
            </p>
            <button className="card-action-button">Add Student</button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="floating-action-button"
        onClick={AddStudent}
        title="Quick Add Student"
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

export default AdminStudentsPage;
