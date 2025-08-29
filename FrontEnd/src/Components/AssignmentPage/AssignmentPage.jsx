import { useState, useEffect, useContext } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TextField,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { Select, MenuItem } from "@mui/material";
import { CurrentUserContext } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import "./AssignmentPage.css";
import { set } from "date-fns";
import { getCookie } from "../Cookie/Cookie.jsx";
import { Back_Origin } from "../../../Front_ENV.jsx";
import PdfViewer from "../PDFViewer/PDFViewer.jsx";
import Loader from "../Loader/Loader.jsx";

const AssignmentPage = ({ assignments }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showMessage, currentUser, setAssignments, courses } =
    useContext(CurrentUserContext);
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const [assignment, setAssignment] = useState({
    title: "",
    courseID: "",
    startDate: "",
    endDate: "",
    description: "",
    document: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editableAssignment, setEditableAssignment] = useState(assignment);

  useEffect(() => {
    if (location.state && location.state.aid) {
      const assignedData = assignments.find(
        (el) => el.id === location.state.aid
      );
      if (assignedData) {
        setAssignment(assignedData);
        setEditableAssignment({
          id: assignedData.id,
          title: assignedData.title,
          course: courses.find((c) => c.id === assignedData.courseID)?.title,
          endDate: assignedData.endDate,
          startDate: assignedData.startDate,
          description: assignedData.description,
          document: assignedData.document,
        });
      }
    } else {
      showMessage("No assignment found", true);
      navigate("/courses");
    }
  }, [location.state, assignments]);

  if (!assignment) {
    return (
      <Container
        maxWidth="md"
        style={{ marginTop: "2rem", position: "relative" }}
      >
        <Card elevation={3} style={{ padding: "1.5rem", position: "relative" }}>
          <CardContent>
            <Typography variant="h4" className="text-center">
              No Assignment Available
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const DeleteAssignment = (assignmentID) => {
    setAssignments((prevState) => {
      return prevState.filter((assignment) => assignment.id !== assignmentID);
    });
    showMessage("Assignment deleted successfully", false);
    navigate("/courses");
  };

  const EditAssignment = () => {
    // Update the original assignment state with editableAssignment
    setAssignment({
      id: assignment.id,
      title: editableAssignment.title,
      courseID: courses.find((c) => c.title === editableAssignment.course)?.id,
      endDate: editableAssignment.endDate,
      startDate: editableAssignment.startDate,
      description: editableAssignment.description,
    });
    setAssignments((prevAssignments) =>
      prevAssignments.map((a) =>
        a.id === assignment.id
          ? {
              ...a,
              title: editableAssignment.title,
              courseID: courses.find(
                (c) => c.title === editableAssignment.course
              )?.id,
              endDate: editableAssignment.endDate,
              startDate: editableAssignment.startDate,
              description: editableAssignment.description,
            }
          : a
      )
    );
    setIsEditing(false);
    showMessage("Assignment updated successfully", false);
  };
  const SubmitAssignment = () => {
    // setViewPdf(false);
    navigate("/AssignmentPage", {
      state: { ...location.state, submitMode: "submit" },
    });
  };
  const ViewAssignment = () => {
    // setViewPdf(true);
    navigate("/AssignmentPage", {
      state: { ...location.state, viewMode: "view" },
    });
  };
  const handleFileChangePdf = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      showMessage("Please upload a valid PDF file.", true);
    }
  };
  const handleSubmitPdf = async (event) => {
    event.preventDefault();
    if (!file) {
      showMessage("Please Attach PDF File", true);
      return;
    }
    setLoader(true);
    const formData = new FormData();
    formData.append("assignmentID", assignment.id);
    formData.append("pdf", file);
    try {
      const response = await fetch(`${Back_Origin}/solveAssignment`, {
        method: "POST",
        body: formData,
        headers: {
          authorization: getCookie("token"),
        },
      });
      const data = await response.json();
      if (data.error) {
        setLoader(false);
        showMessage(data.error, true);
        setFile("");
      } else {
        setLoader(false);
        showMessage(data.message, false);
        navigate("/courses");
      }
    } catch (error) {
      setLoader(false);
      showMessage("Error uploading file", true);
    }
  };
  if (loader) {
    return <Loader />;
  }
  return (
    <>
      {!location.state?.submitMode && !location.state?.viewMode ? (
        <Container
          maxWidth="md"
          style={{ marginTop: "2rem", position: "relative" }}
        >
          <Card
            elevation={3}
            style={{ padding: "1.5rem", position: "relative" }}
          >
            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                style={!isEditing ? { marginBottom: "15px" } : {}}
              >
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={editableAssignment.title}
                    onChange={(e) =>
                      setEditableAssignment({
                        ...editableAssignment,
                        title: e.target.value,
                      })
                    }
                  />
                ) : (
                  assignment.title || "No Assignment Available"
                )}
              </Typography>

              {/* Assignment Information */}
              <Table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Course</td>
                    <td>
                      {isEditing ? (
                        <Select
                          fullWidth
                          value={editableAssignment.course}
                          onChange={(e) =>
                            setEditableAssignment({
                              ...editableAssignment,
                              course: e.target.value,
                            })
                          }
                        >
                          {courses.map((course) => (
                            <MenuItem key={course.id} value={course.title}>
                              {course.title}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        courses.find((c) => c.id === assignment.courseID)
                          ?.title || "Not available"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Start Date</td>
                    <td>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          type="date"
                          variant="outlined"
                          value={editableAssignment.startDate}
                          onChange={(e) =>
                            setEditableAssignment({
                              ...editableAssignment,
                              startDate: e.target.value,
                            })
                          }
                        />
                      ) : (
                        assignment.startDate || "Not available"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>End Date</td>
                    <td>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          type="date"
                          variant="outlined"
                          value={editableAssignment.endDate}
                          onChange={(e) =>
                            setEditableAssignment({
                              ...editableAssignment,
                              endDate: e.target.value,
                            })
                          }
                        />
                      ) : (
                        assignment.endDate || "Not available"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={editableAssignment.description}
                          onChange={(e) =>
                            setEditableAssignment({
                              ...editableAssignment,
                              description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        assignment.description || "No description"
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>

              {/* Assignment Actions */}
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                {isEditing ? (
                  <div className="d-flex justify-content-center gap-5">
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#f44336" }}
                      onClick={() => {
                        setIsEditing(false);
                        setEditableAssignment({
                          id: assignment.id,
                          title: assignment.title,
                          course: courses.find(
                            (c) => c.id === assignment.courseID
                          )?.title,
                          endDate: assignment.endDate,
                          startDate: assignment.startDate,
                          description: assignment.description,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#4caf50" }}
                      onClick={EditAssignment}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-center gap-5">
                      <Button
                        variant="contained"
                        onClick={ViewAssignment}
                        className="pascalCase-text dark-bg light-text backButton-AssignmentPage"
                      >
                        View
                      </Button>
                      {currentUser.role === "Student" && (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#2196f3" }}
                          onClick={SubmitAssignment}
                          className="pascalCase-text green-bg"
                        >
                          Submit
                        </Button>
                      )}
                      <div />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </Container>
      ) : location.state?.submitMode ? (
        <>
          <div className="pdf-upload-container mt-5">
            <h3>Upload PDF</h3>
            <form onSubmit={handleSubmitPdf}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChangePdf}
              />
              <button type="submit">Upload</button>
            </form>
            {file && <p>Selected file: {file.name}</p>}
          </div>
        </>
      ) : (
        location.state.viewMode && (
          <>
            <PdfViewer document={assignment.document} name={assignment.title} />
          </>
        )
      )}
    </>
  );
};

export default AssignmentPage;
