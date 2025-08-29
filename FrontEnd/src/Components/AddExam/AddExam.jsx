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
  console.log(route.state);

  return (
    <Box sx={{ width: "100%" }}>
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
