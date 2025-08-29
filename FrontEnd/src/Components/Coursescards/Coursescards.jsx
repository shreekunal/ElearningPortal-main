import { useContext, useEffect, useRef, useState } from "react";
import { CurrentUserContext } from "../../App.jsx";
import CourseCard from "../CourseCard/CourseCard";
import AddCourseForm from "../AddCourseForm/AddCourseForm.jsx";
import Placeholder from "../Placeholder/Placeholder";
import NoCoursesImg from "../../assets/Student.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { v4 } from "uuid";
import "./Coursescards.css";
import EditCourseForm from "../EditCourseForm/EditCourseForm.jsx";

const CoursesCards = ({ courses, mode, globalFilter }) => {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [coursesList, setCoursesList] = useState([]);
  const CardsContainer = useRef(null);
  const [courseEdit, setCourseEdit] = useState({});
  const { currentUser } = useContext(CurrentUserContext);

  const filterHandler = (filter) => {
    const filteredCourses = courses.filter((course) =>
      course.title.toLowerCase().includes(filter.toLowerCase())
    );
    setCoursesList(filteredCourses);
  };

  useEffect(() => {
    if (globalFilter) {
      filterHandler(globalFilter);
    } else {
      setCoursesList(courses);
    }
  }, [globalFilter, courses]);

  useEffect(() => {
    if (showForm || showEditForm) {
      window.scrollBy(0, 200);
      CardsContainer.current.style.opacity = "0.3";
      CardsContainer.current.style.pointerEvents = "none";
      CardsContainer.current.style.userSelect = "none";
    } else {
      document.body.scrollIntoView({ behavior: "smooth" });
      CardsContainer.current.style.opacity = "1";
      CardsContainer.current.style.pointerEvents = "";
      CardsContainer.current.style.userSelect = "";
    }
  }, [showForm, showEditForm]);

  const showFormHandler = () => {
    setShowForm(!showForm);
  };

  const showEditFormHandler = () => {
    setShowEditForm(!showEditForm);
  };

  return (
    <>
      {showForm && <AddCourseForm showFormHandler={showFormHandler} />}
      {showEditForm && (
        <EditCourseForm
          {...courseEdit}
          showEditFormHandler={showEditFormHandler}
        />
      )}
      <span ref={CardsContainer} style={{ transition: "all 0.3s ease-in-out" }}>
        <div className="courses-buttons-container">
          {currentUser.role && currentUser.role === "Admin" && (
            <button className="AddButton" onClick={showFormHandler}>
              <FontAwesomeIcon icon={faPlus} title="Add Course" />
              Add Course
            </button>
          )}
        </div>
        <div className="cards courses-cards">
          {!coursesList.length && (
            <Placeholder text="No Courses Exists" img={NoCoursesImg} />
          )}
          {coursesList.map((course) => (
            <CourseCard
              setCourseEdit={setCourseEdit}
              showEditFormHandler={showEditFormHandler}
              showFormHandler={showFormHandler}
              key={v4()}
              {...course}
              mode={mode}
            />
          ))}
        </div>
      </span>
    </>
  );
};

export default CoursesCards;
