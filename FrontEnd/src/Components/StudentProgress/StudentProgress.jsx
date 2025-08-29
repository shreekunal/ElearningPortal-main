import { useLocation, useNavigate, useParams } from "react-router";
import StudentProgressRecord from "./StudentProgressRecord";
import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../App.jsx";
import Placeholder from "../Placeholder/Placeholder.jsx";
import CaughtUp from "../../assets/Grades.svg";
import { getCookie } from "../Cookie/Cookie.jsx";
import "./StudentProgress.css";
import Front_ENV from "../../../Front_ENV.jsx";
import Loader from "../Loader/Loader.jsx";
import PdfViewer from "../PDFViewer/PDFViewer.jsx";

const StudentProgress = () => {
  const { currentUser, showMessage, courses } = useContext(CurrentUserContext);
  const [progress, setProgress] = useState([]);
  const [viewPdf, setViewPdf] = useState(false);
  const [viewedDocument, setViewedDocument] = useState(null);
  const { id } = useParams();
  const { name } = useParams();
  const studentId = id || currentUser.id;
  // Decode the name parameter to handle encoded special characters
  const decodedName = name ? decodeURIComponent(name) : null;
  const navigate = useNavigate();
  const route = useLocation();

  useEffect(() => {
    if (!studentId) {
      console.warn("StudentProgress: No studentId available");
      return;
    }

    const apiUrl = `${Front_ENV.Back_Origin}/getStudentProgress?studentID=${studentId}`;
    console.log("StudentProgress: Fetching from", apiUrl);

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: getCookie("token"),
      },
    })
      .then((response) => {
        console.log("StudentProgress: API response status", response.status);
        return response.json().then((data) => {
          console.log("StudentProgress: API response data", data);
          if (!data.error) {
            showMessage(response.message, false);
            setProgress(data.data);
          } else {
            showMessage(data.error, true);
          }
        });
      })
      .catch((error) => {
        console.error("StudentProgress: API error", error);
        showMessage("Failed to load progress data", true);
      });
  }, [studentId]);

  return (
    <div className="mt-5">
      <h5 className="alignCenter-text">
        {decodedName || currentUser.name}'s Progress
      </h5>
      {!viewPdf ? (
        <div className="student-progress-table-container">
          <table className="student-progress-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: "15px" }}>Course</th>
                <th>Exam/Assignment</th>
                <th>Submitted</th>
                {currentUser.role === "Instructor" && <th>Submission</th>}
                <th style={{ paddingRight: "15px" }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {progress.length === 0 ? (
                <tr style={{ background: "none" }}>
                  <td colSpan="5">
                    <Placeholder text="You're all caught up" img={CaughtUp} />
                  </td>
                </tr>
              ) : !route.state ||
                !route.state.courseID ||
                progress.find(
                  (record) => record.course === route.state.courseID
                ) ? (
                progress
                  .map((record) => {
                    const course = courses.find(
                      (course) => course.id === record.course
                    );
                    // If there's a courseID filter, highlight matching records
                    // If no courseID filter, show all records without highlighting
                    const shouldHighlight =
                      route.state &&
                      route.state.courseID &&
                      route.state.courseID === record.course;
                    const shouldShow =
                      !route.state ||
                      !route.state.courseID ||
                      route.state.courseID === record.course;

                    return shouldShow ? (
                      <StudentProgressRecord
                        highlighted={shouldHighlight}
                        key={record.id}
                        record={record}
                        courseName={course.title}
                        setViewPdf={setViewPdf}
                        setViewedDocument={setViewedDocument}
                      />
                    ) : null;
                  })
                  .filter(Boolean)
              ) : (
                <tr style={{ background: "none" }}>
                  <td colSpan="5">
                    <Placeholder
                      text="No progress for in this student"
                      img={CaughtUp}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <PdfViewer
            document={viewedDocument.document}
            name={viewedDocument.name}
          />
        </>
      )}
    </div>
  );
};

export default StudentProgress;
