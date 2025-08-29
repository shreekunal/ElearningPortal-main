import { useContext } from "react";
import CoursesCards from "../Coursescards/Coursescards";
import { CurrentUserContext } from "../../App.jsx";

const CoursesPage = ({ courses, mode }) => {
  const { searchFilter } = useContext(CurrentUserContext);

  return (
    <>
      <CoursesCards courses={courses} mode={mode} globalFilter={searchFilter} />
    </>
  );
};

export default CoursesPage;
