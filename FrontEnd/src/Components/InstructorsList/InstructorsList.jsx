import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import UserCard from "../UserCard/UserCard";
import Placeholder from "../Placeholder/Placeholder.jsx";
import NoInstructorsImg from "../../assets/Instructor.svg";
import { CurrentUserContext } from "../../App.jsx";
import { useLocation } from "react-router-dom";
import Front_ENV from "../../../Front_ENV.jsx";
import { getCookie } from "../Cookie/Cookie.jsx";

const InstructorsList = () => {
  const { showMessage } = useContext(CurrentUserContext);
  const [instructorsList, setInstructorsList] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const { id, CourseId } = useParams();
  const navigate = useNavigate();
  const route = useLocation();

  const fetchInstructors = async () => {
    const params = new URLSearchParams({
      courseId: id,
      type: "instructors",
    });
    if (route.state.isAdmin) {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/getUsers?role=Instructor`,
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
      setInstructorsList(response.data);
      route.state = { instructorsList: response.data, isAdmin: true };
    } else if (!route.state.assignInstructor) {
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
      if (response.error) {
        showMessage(response.error, true);
        return;
      }
      setInstructorsList(response.data);
      route.state = { instructorsList: response.data };
    } else {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/getUsers?role=Instructor&courseID=${CourseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: getCookie("token") || "",
          },
        }
      ).then((response) => response.json());
      setInstructorsList(response.data);
      route.state = { instructorsList: response.data, assignInstructor: true };
    }
  };

  useEffect(() => {
    console.log("InstructorsList useEffect - route.state:", route.state);
    console.log("InstructorsList useEffect - id:", id);
    console.log("InstructorsList useEffect - CourseId:", CourseId);

    if (!route.state) {
      setInstructorsList([]);
      showMessage("Access Denied", true);
      // Navigate to appropriate page based on available parameters
      if (id) {
        navigate(`/CourseDetails/${id}`);
      } else {
        navigate("/InstructorsPage"); // Default to instructors page for admin
      }
    } else {
      fetchInstructors();
    }
  }, [updateList]);

  return (
    <>
      <div className="d-flex flex-column mt-5">
        <h5 className="sub-title">
          {route.state.assignInstructor ? "" : instructorsList.length}{" "}
          {route.state.isAdmin
            ? "Instructors"
            : route.state.assignInstructor
            ? "Assign Instructors"
            : "Course Instructors"}{" "}
        </h5>
        {!instructorsList.length && (
          <Placeholder text="No Instructors Added" img={NoInstructorsImg} />
        )}
        {instructorsList.map((instructor) => (
          <UserCard
            setUpdateList={setUpdateList}
            updateList={updateList}
            isStudent={false}
            instructor={instructor}
            key={instructor.id}
            student={false}
            isAdmin={route.state.isAdmin}
            isAssigned={instructor.isAssigned}
            assignInstructor={route.state.assignInstructor}
            courseId={CourseId}
          />
        ))}
      </div>
    </>
  );
};

export default InstructorsList;
