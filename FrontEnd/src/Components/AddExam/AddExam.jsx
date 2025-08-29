import { useState, useEffect } from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router";
const steps = ["Exam Info", "Add Questions"];
import AddQuestions from "./AddQuestions";
import ExamInfo from "./ExamInfo";
import { useParams } from "react-router";
import "./AddExam.css";

const AddExam = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [examTitleValue, setExamTitleValue] = useState();
  const navigate = useNavigate();
  const route = useLocation();

  const handleNext = (examTitle) => {
    navigate(`/AddExam/${id}`, {
      state: { activeStep: ++route.state.activeStep },
    });
    setExamTitleValue(examTitle);
  };

  const handleBack = () => {
    navigate(`/AddExam/${id}`, {
      state: { activeStep: --route.state.activeStep },
    });
  };
  console.log(route.state)

  return (
    <Box sx={{ width: "100%" }}>
      <button
        className="goBackBtn"
        style={{ top: "5px" }}
        onClick={() => {
            if (route.state?.materialCard) {
                navigate(`/examQuestions/${route.state.eid}`, {
                    state: { courseID: route.state.cid, materialCard: true },
                });
            } else if (route.state?.mode) {
                navigate(`/examQuestions/${route.state.eid}`, {
                    state: { courseID: route.state.cid },
                });
            } else {
                navigate(`/AddMaterial/${id}`)
            }
        }}
      >
        <svg
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 1024 1024"
        >
          <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
        </svg>
        <span>Back</span>
      </button>
      <Box sx={{ width: "80%", margin: "100px auto 50px" }}>
        <Stepper activeStep={route.state.activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={(props) => (
                  <div
                    style={{
                      backgroundColor: props.completed
                        ? "#2d3480"
                        : props.active
                        ? "#2d3480"
                        : "gray",
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    {index + 1}
                  </div>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ mt: 0, mb: 2 }}>
        {route.state.activeStep === 0 ? (
          <ExamInfo
            handleNext={handleNext}
            formData={formData}
            setFormData={setFormData}
            id={id}
          />
        ) : (
          <AddQuestions
            handleBack={handleBack}
            formData={formData}
            setFormData={setFormData}
            id={id}
            examTitle={examTitleValue}
          />
        )}
      </Box>
    </Box>
  );
};

export default AddExam;
