import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CurrentUserContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../Components/CourseMaterial/CourseMaterial.css";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getCookie } from "../Cookie/Cookie.jsx";
import "./MaterialCard.css";
import { jwtDecode } from "jwt-decode";
import Front_ENV, { Back_Origin } from "../../../Front_ENV.jsx";

const MaterialCard = ({ material, courseId }) => {
  const { showMessage, materials, setExams, confirmationToast, currentUser } =
    useContext(CurrentUserContext);
  const navigate = useNavigate();
  const params = useParams();
  const [seeMore, setSeeMore] = useState(true);
  const handleSeeMore = () => {
    setSeeMore(!seeMore);
  };

  const deleteExamHandler = async () => {
    const isConfirmed = await confirmationToast(
      "Are You Sure You Want to remove this exam?"
    );
    if (isConfirmed) {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/deleteExam/${material.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: getCookie("token"),
          },
        }
      ).then((res) => res.json());
      if (!response.error) {
        setExams((prevState) =>
          prevState.filter((exam) => exam.id !== material.id)
        );
        showMessage(response.message, false);
        navigate(`/CourseDetails/${params.id}`);
      } else {
        showMessage(response.error, true);
      }
    }
  };

  const deleteAssignmentHandler = async () => {
    const isConfirmed = await confirmationToast(
      "Are You Sure You Want to delete assignment?"
    );

    if (isConfirmed) {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/deleteAssignment/${material.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: getCookie("token") || "",
          },
        }
      );

      const data = await response.json();

      if (data.error) {
        showMessage(data.error, true);
      } else {
        navigate(`/CourseDetails/${params.id}`);
        showMessage(data.message, false);
      }
    }
  };

  const editAssignmentHandler = () => {
    showMessage("Edit assignment coming soon", null);
  };

  const editExamHandler = async () => {
    navigate(`/examQuestions/${material.id}`, {
      state: { courseID: courseId, materialCard: true },
    });
  };

  return (
    <>
      {material.materialType === "exam" ? (
        <div className=" card material-card ">
          <div className=" material-sub-card">
            <FontAwesomeIcon
              className="material-icon"
              size="3x"
              icon={faFileAlt}
              color="#274546"
            />
            <div>
              <div className="material-title-due">
                <h6>
                  {material.instructorName} posted a new exam :{material.title}
                </h6>
              </div>
              <h6 className="material-date">
                {material.startDate} - {material.endDate}
              </h6>
            </div>
          </div>
          {currentUser.role === "Instructor" && (
            <div className="course-icons-materialCard admin-icons">
              <FontAwesomeIcon
                icon={faEdit}
                style={{ cursor: "pointer" }}
                className="edit-icon"
                onClick={editExamHandler}
              />
              <FontAwesomeIcon
                icon={faTrash}
                style={{ color: "red", cursor: "pointer" }}
                onClick={deleteExamHandler}
              />
            </div>
          )}
        </div>
      ) : material.materialType === "assignment" ? (
        <div className=" card material-card ">
          <div className=" material-sub-card">
            <FontAwesomeIcon
              className="material-icon"
              size="3x"
              icon={faBookOpen}
              color="#274546"
            />
            <div>
              <div className="material-title-due">
                <h6>
                  {material.instructorName} posted a new assignment :
                  {material.title}
                </h6>
              </div>
              <h6 className="material-date">
                {material.startDate} - {material.endDate}
              </h6>
            </div>
          </div>{" "}
          {currentUser.role === "Instructor" && (
            <div className="course-icons-materialCard admin-icons">
              <FontAwesomeIcon
                icon={faEdit}
                style={{ cursor: "pointer" }}
                className="edit-icon"
                onClick={editAssignmentHandler}
              />
              <FontAwesomeIcon
                icon={faTrash}
                style={{ color: "red", cursor: "pointer" }}
                onClick={deleteAssignmentHandler}
              />
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default MaterialCard;
