import "./CourseMaterial.css";
import MaterialCard from "../MaterialCard/MaterialCard";
import { useContext } from "react";
import { CurrentUserContext } from "../../App.jsx";
import Placeholder from "../Placeholder/Placeholder.jsx";
import NoMaterialsImg from "../../assets/Student.svg";

const CourseMaterial = ({ courseId }) => {
  const { materials } = useContext(CurrentUserContext);
  return (
    <>
      {materials.map((material) => (
        <MaterialCard
          key={material.id}
          material={material}
          courseId={courseId}
        />
      ))}
    </>
  );
};

export default CourseMaterial;
