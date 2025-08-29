import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserCard from "../UserCard/UserCard";
import Placeholder from "../Placeholder/Placeholder.jsx";
import NoStudentsImg from "../../assets/Student.svg";
import { CurrentUserContext } from "../../App.jsx";
import { useLocation } from "react-router-dom";
import Front_ENV from "../../../Front_ENV.jsx";
import { getCookie } from "../Cookie/Cookie.jsx";

const AdminStudentsList = () => {
  const { showMessage } = useContext(CurrentUserContext);
  const [studentsList, setStudentsList] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const navigate = useNavigate();
  const route = useLocation();

  const fetchStudents = async () => {
    if (route.state && route.state.isAdmin) {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/getUsers?role=Student`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: getCookie("token") || "",
          },
        }
      ).then((response) => response.json());

      if (response.error) {
        showMessage(response.error, true);
        return;
      }

      setStudentsList(response.data);
      route.state = { studentsList: response.data, isAdmin: true };
    }
  };

  useEffect(() => {
    console.log("AdminStudentsList useEffect - route.state:", route.state);

    if (!route.state) {
      setStudentsList([]);
      showMessage("Access Denied", true);
      navigate("/StudentsPage");
    } else {
      fetchStudents();
    }
  }, [updateList]);

  return (
    <>
      <div className="d-flex flex-column mt-5">
        <h5 className="sub-title">{studentsList.length} Students</h5>
        {!studentsList.length && (
          <Placeholder text="No Students Added" img={NoStudentsImg} />
        )}
        {studentsList.map((student) => (
          <UserCard
            setUpdateList={setUpdateList}
            updateList={updateList}
            isStudent={true}
            student={student}
            key={student.id}
            isAdmin={route.state.isAdmin}
          />
        ))}
      </div>
    </>
  );
};

export default AdminStudentsList;
