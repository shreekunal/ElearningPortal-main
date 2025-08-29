import { useContext } from "react";
import { CurrentUserContext } from "../../App";
import 'bootstrap/dist/css/bootstrap.min.css';
import Placeholder from '../Placeholder/Placeholder';
import { useNavigate,useParams } from 'react-router';
import ExamImg from '../../assets/Grades.svg';
import AssignmentImg from '../../assets/Student.svg';
import AnnouncementImg from '../../assets/Announcement.svg';
import NotFoundImg from '../../assets/404.svg';
import './AddMaterial.css';

const AddMaterial = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentUserContext);

    const AddAssignment = ()=>{
        navigate(`/AddAssignment/${id}`);
    }
    const AddExam = ()=>{
        navigate(`/AddExam/${id}`, {state: {activeStep: 0}});
    }
    const AddAnnouncement = ()=>{
        navigate(`/AddAnnouncement/${id}`)
    }

  return (
      <>
          <button className="goBackBtn" style={{top: "35px", left: "85px"}}
                  onClick={() => navigate(`/CourseDetails/${id}`)}>
              <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
                  <path
                      d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
              </svg>
              <span>Back</span>
          </button>
          {(currentUser.role === "Instructor") ? (<div className="add-material-component">
              <div className="card add-material-card" onClick={AddAssignment}>
                  <div className="add-material-header card-header green-bg light-text">
                      <h4>Add Assignment</h4>
                  </div>
                  <div className="card-body add-material-body ">
                      <img src={AssignmentImg} alt="Assignment"/>
                  </div>
              </div>
              <div className="card add-material-card" onClick={AddExam}>
                  <div className="add-material-header card-header green-bg light-text">
                      <h4>Add Exam</h4>
                  </div>
                  <div className="card-body add-material-body">
                      <img src={ExamImg} alt="Exam"/>
                  </div>
              </div>
              <div className="card add-material-card" onClick={AddAnnouncement}>
                  <div className="add-material-header card-header green-bg light-text">
                      <h4>Add Announcement</h4>
                  </div>
                  <div className="card-body add-material-body">
                      <img src={AnnouncementImg} alt="Announcement"/>
                  </div>
              </div>
          </div>) : (
              <Placeholder
                  text="Page Not Found"
                  img={NotFoundImg}
                  buttonText="Back To Home"
                  buttonRoute="/"
              />
          )
          }
      </>
  )
}

export default AddMaterial
