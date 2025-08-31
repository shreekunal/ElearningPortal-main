import { useContext } from "react";
import { CurrentUserContext } from "../../App";
import "bootstrap/dist/css/bootstrap.min.css";
import Placeholder from "../Placeholder/Placeholder";
import { useNavigate, useParams } from "react-router";
import NotFoundImg from "../../assets/404.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faPlus,
  faBook,
  faQuestionCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import "./AddMaterial.css";

const AddMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);

  const CreateUnit = () => {
    navigate(`/CreateUnit/${id}`);
  };

  return (
    <>
      {currentUser.role === "Instructor" ? (
        <div className="add-material-container">
          <div className="add-material-header">
            <h2 className="page-title">
              <FontAwesomeIcon icon={faPlus} className="title-icon" />
              Design Course Units
            </h2>
            <p className="page-subtitle">
              Create structured learning units with multiple chapters and
              assessments.
            </p>
          </div>

          <div className="unit-creation-section">
            <div className="unit-card" onClick={CreateUnit}>
              <div className="unit-header">
                <div className="unit-icon-wrapper">
                  <FontAwesomeIcon icon={faLayerGroup} className="unit-icon" />
                </div>
                <div className="unit-title-section">
                  <h3 className="unit-title">Create New Unit</h3>
                  <p className="unit-description">
                    Design a complete learning unit with chapters and quiz
                  </p>
                </div>
              </div>

              <div className="unit-structure">
                <div className="structure-item">
                  <FontAwesomeIcon icon={faBook} className="structure-icon" />
                  <span>Multiple Chapters</span>
                </div>
                <div className="structure-divider">+</div>
                <div className="structure-item">
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="structure-icon"
                  />
                  <span>Unit Quiz</span>
                </div>
              </div>

              <div className="unit-action">
                <span className="action-text">Start Building Unit</span>
                <FontAwesomeIcon icon={faArrowRight} className="action-arrow" />
              </div>
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
