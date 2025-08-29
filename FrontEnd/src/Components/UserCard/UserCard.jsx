import "bootstrap/dist/css/bootstrap.min.css";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router";
import { CurrentUserContext } from "../../App.jsx";
import "./UserCard.css";
import { getCookie } from "../Cookie/Cookie.jsx";
import Front_ENV from "../../../Front_ENV.jsx";

const UserCard = ({
  isStudent,
  student,
  instructor,
  updateList,
  setUpdateList,
  isAdmin,
  assignInstructor,
  courseId,
  isAssigned,
}) => {
  const { currentUser, showMessage, confirmationToast } =
    useContext(CurrentUserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const RemoveStudent = async () => {
    const isConfirmed = await confirmationToast(
      "Are You Sure You Want to remove student?"
    );
    if (isConfirmed) {
      const response = await fetch(`${Front_ENV.Back_Origin}/unenroll-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
        body: JSON.stringify({
          userId: student.id,
          courseId: id,
        }),
      }).then((response) => response.json());

      if (response.error) {
        showMessage(response.error, true);
      } else {
        setUpdateList(!updateList);
        showMessage(response.message, false);
      }
    }
  };

  const RemoveInstructor = async () => {
    const isConfirmed = await confirmationToast(
      "Are You Sure You Want to remove instructor?"
    );
    if (isConfirmed) {
      const response = await fetch(`${Front_ENV.Back_Origin}/unenroll-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
        body: JSON.stringify({
          userId: instructor.id,
          courseId: id,
        }),
      }).then((response) => response.json());

      if (response.error) {
        showMessage(response.error, true);
      } else {
        setUpdateList(!updateList);
        showMessage(response.message, false);
      }
    }
  };

  const RemoveUser = async () => {
    const userToDelete = isStudent ? student : instructor;
    const userType = isStudent ? "student" : "instructor";

    const isConfirmed = await confirmationToast(
      `Are You Sure You Want to remove this ${userType}?`
    );
    if (isConfirmed) {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/deleteUser/${userToDelete.id}`,
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
        setUpdateList(!updateList);
        showMessage(response.message, false);
      }
    }
  };
  const AssignInstructor = async () => {
    const isConfirmed = await confirmationToast(
      `Are you sure you want to assign ${instructor.name}?`
    );
    if (!isConfirmed) return;

    const response = await fetch(`${Front_ENV.Back_Origin}/enroll-course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: getCookie("token") || "",
      },
      body: JSON.stringify({
        userId: instructor.id,
        courseId: courseId,
        duration: 1,
      }),
    }).then((response) => response.json());
    if (response.error) {
      showMessage(response.error, true);
    } else {
      setUpdateList(!updateList);
      showMessage(response.message, false);
    }
  };

  const UnAssignInstructor = async () => {
    const isConfirmed = await confirmationToast(
      `Are you sure you want to unassign ${instructor.name}?`
    );
    if (!isConfirmed) return;

    const response = await fetch(`${Front_ENV.Back_Origin}/unenroll-course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: getCookie("token") || "",
      },
      body: JSON.stringify({
        userId: instructor.id,
        courseId: courseId,
      }),
    }).then((response) => response.json());
    if (response.error) {
      showMessage(response.error, true);
    } else {
      setUpdateList(!updateList);
      showMessage(response.message, false);
    }
  };

  const ViewProgress = () => {
    // If there's a course ID from route params, pass it in state for filtering
    // If no course ID (like in admin student management), show all progress
    const navigationState = id ? { courseID: id } : {};

    // Encode the student name to handle spaces and special characters
    const encodedName = encodeURIComponent(student.name);

    navigate(`/ViewProgress/${student.id}/${encodedName}`, {
      state: navigationState,
    });
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on delete button or assign/unassign buttons
    if (
      e.target.closest(".remove-user-button") ||
      e.target.closest(".assign-button")
    ) {
      return;
    }

    console.log("Card clicked for student:", student);
    console.log("Current route params id:", id);

    // Only navigate to progress for students
    if (isStudent) {
      console.log("Navigating to ViewProgress...");
      ViewProgress();
    }
  };
  return (
    <div
      className={`card user-card card-shadow ${
        isStudent ? "clickable-card" : ""
      }`}
      onClick={isStudent ? handleCardClick : undefined}
    >
      <div className=" user-sub-card">
        <img
          src={
            `https://ui-avatars.com/api/?background=2d3480&color=` +
            `fb8928&rounded=true&name=${currentUser.name}`
          }
          alt="user"
          className="user-list-user-avatar"
        />
        <div className="user-details-container">
          <div className="user-details">
            <h6>{isStudent ? student.name : instructor.name}</h6>
          </div>
          <h6 className="user-name">
            {isStudent ? student.username : instructor.username}
          </h6>
        </div>

        {currentUser.role === "Admin" && !assignInstructor && (
          <FontAwesomeIcon
            className="remove-user-button"
            icon={faTrash}
            onClick={(e) => {
              e.stopPropagation();
              if (isAdmin) {
                // Admin user management - permanently delete user
                RemoveUser();
              } else {
                // Course-specific removal - unenroll from course
                if (isStudent) {
                  RemoveStudent();
                } else {
                  RemoveInstructor();
                }
              }
            }}
            color="red"
          />
        )}
        {assignInstructor &&
          isAssigned !== undefined &&
          (!isAssigned ? (
            <button
              className="assign-button progress-button"
              onClick={(e) => {
                e.stopPropagation();
                AssignInstructor();
              }}
            >
              Assign
            </button>
          ) : (
            <button
              className="assign-button progress-button"
              style={{ background: "#dc2626" }}
              onClick={(e) => {
                e.stopPropagation();
                UnAssignInstructor();
              }}
            >
              Unassign
            </button>
          ))}
      </div>
    </div>
  );
};

export default UserCard;
