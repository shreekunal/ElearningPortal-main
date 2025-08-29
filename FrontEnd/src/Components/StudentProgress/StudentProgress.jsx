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
  const navigate = useNavigate();
  const route = useLocation();

  useEffect(() => {
    fetch(
      `${Front_ENV.Back_Origin}/getStudentProgress?studentID=${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token"),
        },
      }
    ).then((response) => {
      return response.json().then((data) => {
        if (!data.error) {
          showMessage(response.message, false);
          setProgress(data.data);
        } else {
          showMessage(data.error, true);
        }
      });
    });
  }, [studentId]);

  return (
    <div className="mt-5">
      {route.state && route.state.courseID && (
        <button
          className="goBackBtn"
          style={{ top: "15px", left: "30px" }}
          onClick={() => navigate(`/CourseDetails/${route.state.courseID}`)}
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
      )}
      <h5 className="alignCenter-text">
        {name || currentUser.name}'s Progress
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
                progress.find(
                  (record) => record.course === route.state.courseID
                ) ? (
                progress.map((record) => {
                  const course = courses.find(
                    (course) => course.id === record.course
                  );
                  return route.state &&
                    route.state.courseID === record.course ? (
                    <StudentProgressRecord
                      highlighted={true}
                      key={record.id}
                      record={record}
                      courseName={course.title}
                      setViewPdf={setViewPdf}
                      setViewedDocument={setViewedDocument}
                    />
                  ) : (
                    <StudentProgressRecord
                      key={record.id}
                      record={record}
                      courseName={course.title}
                      setViewPdf={setViewPdf}
                      setViewedDocument={setViewedDocument}
                    />
                  );
                })
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
