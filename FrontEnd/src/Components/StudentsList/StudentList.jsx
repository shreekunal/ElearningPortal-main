import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import UserCard from "../UserCard/UserCard";
import { CurrentUserContext } from "../../App.jsx";
import Placeholder from "../Placeholder/Placeholder.jsx";
import NoStudentsImg from "../../assets/Grades.svg";
import { useLocation } from "react-router-dom";
import { getCookie } from "../Cookie/Cookie.jsx";
import Front_ENV from "../../../Front_ENV.jsx";

const StudentList = () => {
  const { id } = useParams();
  const { showMessage } = useContext(CurrentUserContext);
  const [studentsList, setStudentsList] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const navigate = useNavigate();
  const route = useLocation();

  const fetchStudents = async () => {
    const params = new URLSearchParams({
      courseId: id,
      type: "students",
    });
    const response = await fetch(
      `${Front_ENV.Back_Origin}/getCourseUsersList?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      }
    ).then((response) => response.json());

    setStudentsList(response.data);
    route.state = { state: { studentsList: response.data } };
  };

  useEffect(() => {
    if (!route.state) {
      setStudentsList([]);
      showMessage("Access Denied", true);
      navigate(`/CourseDetails/${id}`);
    } else {
      fetchStudents();
    }
  }, [updateList]);

  return (
    <>
      <div className="d-flex flex-column mt-5">
        <h5 className="sub-title">{studentsList.length} Enrolled Students: </h5>
        {!studentsList.length && (
          <Placeholder text="No Students Enrolled" img={NoStudentsImg} />
        )}
        {studentsList.map((student) => (
          <UserCard
            setUpdateList={setUpdateList}
            updateList={updateList}
            isStudent={true}
            student={student}
            key={student.id}
          />
        ))}
      </div>
    </>
  );
};

export default StudentList;
