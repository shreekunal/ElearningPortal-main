import React, { useContext, useState } from "react";
import "./AddAssignment.css";
import { CurrentUserContext } from "../../App.jsx";
import { v4 } from "uuid";
import { MenuItem, Select } from "@mui/material";
import { useNavigate, useParams } from "react-router";

let errorList = [];

const AddAssignment = ({ addHandler, showFormHandler }) => {
  const { id } = useParams();
  const navigate = useNavigate(null);
  const { showMessage, courses } = useContext(CurrentUserContext);
  const currentCourse = courses.find((course) => course.id === id);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    startDate: "",
    endDate: "",
    duration: "", // Duration in hours
    document: "",
    course: courses[0].title,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "title" && e.target.value && !isNaN(e.target.value)) {
      if (!errorList.includes("Title must be a string")) {
        errorList.push("Title must be a string");
      }
    } else {
      if (e.target.name === "title") {
        errorList = errorList.filter((e) => e !== "Title must be a string");
      }
    }

    if (e.target.name === "desc" && e.target.value && !isNaN(e.target.value)) {
      if (!errorList.includes("Description must be a string")) {
        errorList.push("Description must be a string");
      }
    } else {
      if (e.target.name === "desc") {
        errorList = errorList.filter(
          (e) => e !== "Description must be a string"
        );
      }
    }

    // Validation for startDate and endDate
    if (e.target.name === "endDate") {
      if (e.target.value <= form.startDate) {
        if (!errorList.includes("End date must be after the start date")) {
          errorList.push("End date must be after the start date");
        }
      } else {
        errorList = errorList.filter(
          (e) => e !== "End date must be after the start date"
        );
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) return;
    if (errorList.length) return;

    if (id) {
      const { title, desc, duration, document, startDate, endDate } = e.target;
      addHandler({
        title: title.value,
        description: desc.value,
        id: v4(),
        startDate: startDate.value,
        endDate: endDate.value,
        duration: duration, // Duration in hours
        document: document.value,
        courseID: id,
      });
      showMessage("Assignemnt added successfully", false);
      navigate(`/CourseDetails/${id}`);
    } else {
      const { title, desc, duration, document, startDate, endDate, course } =
        e.target;
      addHandler({
        title: title.value,
        description: desc.value,
        id: v4(),
        startDate: startDate.value,
        endDate: endDate.value,
        duration: duration, // Duration in hours
        document: document.value,
        courseID: courses.find((c) => c.title === course.value).id,
      });
      showMessage("Assignment added successfully", false);
      showFormHandler();
    }
  };

  return (
    <>
      <div
        className="form-container-addAssignment"
        style={
          id
            ? { position: "unset", margin: "30px auto", transform: "none" }
            : {}
        }
      >
        <h4 className="green-text alignCenter-text bold-text form-title">
          Add Assignment
        </h4>
        {errorList.length > 0 && (
          <div className="alert alert-danger">
            {errorList.map((error) => (
              <div key={v4()}>
                <span style={{ fontSize: "17px" }}>∗</span> {error}
              </div>
            ))}
          </div>
        )}
        <form className="form ps-2 pe-2" onSubmit={handleSubmit}>
          <div className="d-flex flex-column gap-3">
            <div className="form-group">
              <label htmlFor="title" className="green-text bold-text">
                Title
              </label>
              <input
                onChange={handleChange}
                value={form.title}
                type="text"
                id="title"
                name="title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="document" className="green-text bold-text">
                Document
              </label>
              <input
                onChange={handleChange}
                value={form.document}
                style={{ color: "black" }}
                type="file"
                id="document"
                name="document"
                required
              />
            </div>
          </div>
          <div className="form-group justify-content-between">
            <label htmlFor="startDate" className="green-text bold-text">
              Start Date
            </label>
            <input
              onChange={handleChange}
              value={form.startDate}
              style={{ height: "57px" }}
              type="datetime-local"
              id="startDate"
              name="startDate"
              required
            />
          </div>
          <div className="form-group justify-content-between">
            <label htmlFor="endDate" className="green-text bold-text">
              End Date
            </label>
            <input
              onChange={handleChange}
              value={form.endDate}
              style={{ height: "57px" }}
              disabled={!form.startDate}
              type="datetime-local"
              id="endDate"
              name="endDate"
              required
            />
          </div>
          <div className={!id ? "d-flex justify-content-between gap-3" : ""}>
            <div
              className="form-group justify-content-between"
              style={{ width: "47%" }}
            >
              <label htmlFor="duration" className="green-text bold-text">
                Duration
              </label>
              <input
                onChange={handleChange}
                value={form.duration}
                style={{ height: "57px" }}
                type="number"
                id="duration"
                name="duration"
                required
              />
            </div>
            {id && (
              <div className="form-group" style={{ width: "47%" }}>
                <label htmlFor="courseTitle" className="green-text bold-text">
                  Course Title
                </label>
                <input
                  name="courseTitle"
                  readOnly
                  value={currentCourse.title || "Course Not Available"}
                />
              </div>
            )}
            {!id && (
              <div className="form-group flex-grow-1" style={{ width: "47%" }}>
                <label htmlFor="course" className="green-text bold-text">
                  Course
                </label>
                <Select
                  sx={{
                    borderRadius: "8px",
                    border: "2px solid #274546",
                    fontWeight: "600",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  fullWidth
                  value={form.course}
                  id="course"
                  onChange={handleChange}
                  name="course"
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.title}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="desc" className="green-text bold-text">
              Description
            </label>
            <textarea
              onChange={handleChange}
              value={form.desc}
              name="desc"
              id="desc"
              rows="10"
              cols="50"
              required
            />
          </div>

          <div className="d-flex flex-column justify-content-between mt-2 mb-2">
            {errorList.length ||
            !form.startDate ||
            !form.endDate ||
            !form.document ||
            !form.desc ||
            !form.title ||
            !form.duration ||
            !form.course ? (
              <button disabled className="btn AddCourseButton" type="submit">
                Add
              </button>
            ) : (
              <button className="btn AddCourseButton" type="submit">
                Add
              </button>
            )}
            <button
              className="btn btn-outline-danger CancelButton"
              onClick={() => {
                if (id) {
                  navigate(`/AddMaterial/${id}`);
                } else {
                  showFormHandler();
                  errorList = [];
                }
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAssignment;
