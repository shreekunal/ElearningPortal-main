import { useContext } from "react";
import { CurrentUserContext } from "../../App";
import "bootstrap/dist/css/bootstrap.min.css";
import Placeholder from "../Placeholder/Placeholder";
import { useNavigate, useParams } from "react-router";
import ExamImg from "../../assets/Grades.svg";
import AssignmentImg from "../../assets/Student.svg";
import AnnouncementImg from "../../assets/Announcement.svg";
import NotFoundImg from "../../assets/404.svg";
import "./AddMaterial.css";

const AddMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);

  const AddAssignment = () => {
    navigate(`/AddAssignment/${id}`);
  };
  const AddExam = () => {
    navigate(`/AddExam/${id}`, { state: { activeStep: 0 } });
  };
  const AddAnnouncement = () => {
    navigate(`/AddAnnouncement/${id}`);
  };

  return (
    <>
      {currentUser.role === "Instructor" ? (
        <div className="add-material-component">
          <div className="card add-material-card" onClick={AddAssignment}>
            <div className="add-material-header card-header green-bg light-text">
              <h4>Add Assignment</h4>
            </div>
            <div className="card-body add-material-body ">
              <img src={AssignmentImg} alt="Assignment" />
            </div>
          </div>
          <div className="card add-material-card" onClick={AddExam}>
            <div className="add-material-header card-header green-bg light-text">
              <h4>Add Exam</h4>
            </div>
            <div className="card-body add-material-body">
              <img src={ExamImg} alt="Exam" />
            </div>
          </div>
          <div className="card add-material-card" onClick={AddAnnouncement}>
            <div className="add-material-header card-header green-bg light-text">
              <h4>Add Announcement</h4>
            </div>
            <div className="card-body add-material-body">
              <img src={AnnouncementImg} alt="Announcement" />
            </div>
          </div>
        </div>
      ) : (
        <Placeholder
          text="Page Not Found"
          img={NotFoundImg}
          buttonText="Back To Home"
          buttonRoute="/"
        />
      )}
    </>
  );
};

export default AddMaterial;
