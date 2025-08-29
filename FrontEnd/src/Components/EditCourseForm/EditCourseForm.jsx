import React, { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../App.jsx";
import { v4 } from "uuid";
import "./EditCourseForm.css";
import { Button } from "@mui/material";
import { getCookie } from "../Cookie/Cookie.jsx";
import Front_ENV from "../../../Front_ENV.jsx";
import axios from "axios";

let errorList = [];

const EditCourseForm = ({
  id,
  title,
  desc,
  hours,
  image,
  showEditFormHandler,
}) => {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    hours: "",
    image: image,
  });

  const [courseData, setCourseData] = useState({});
  const { showMessage, setCourses, fetchCourses } =
    useContext(CurrentUserContext);

  const editCourseHandler = async (id, updatedCourse) => {
    if (typeof form.image === "string") {
      // Fetch the file as a blob
      const imageReponse = await axios.get(
        `${Front_ENV.Back_Origin}/${form.image}`,
        {
          responseType: "blob",
        }
      );

      // Extract the filename from the file path
      const filename = form.image.split("/").pop();
      console.log(form.image.split("\\"));

      // Convert the blob into a File object
      const file = new File([imageReponse.data], filename, {
        type: imageReponse.data.type,
      });

      updatedCourse.image = file;
    }

    const formData = new FormData();
    formData.append("title", updatedCourse.title);
    formData.append("desc", updatedCourse.desc);
    formData.append("hours", updatedCourse.hours);
    formData.append("image", updatedCourse.image);

    const response = await fetch(
      `${Front_ENV.Back_Origin}/update-course/${id}`,
      {
        method: "PUT",
        headers: {
          authorization: getCookie("token") || "",
        },
        body: formData,
      }
    ).then((response) => response.json());

    if (response.error) {
      showMessage(response.error, true);
      return;
    }

    setCourses((prevState) => {
      return prevState.map((course) => {
        if (course.id === id) {
          return { ...course, ...response.data };
        }
        return course;
      });
    });

    showMessage(response.message, false);
    showEditFormHandler();
    // Refresh courses list to ensure we have the latest data
    fetchCourses();
  };

  useEffect(() => {
    setForm({ title, desc, hours, image });
    setCourseData({ id, title, desc, hours });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] }); // Store the image file
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }

    if (e.target.name === "hours" && e.target.value && e.target.value < 1) {
      if (!errorList.includes("Hours must be greater than 0")) {
        errorList.push("Hours must be greater than 0");
      }
    } else {
      if (e.target.name === "hours") {
        errorList = errorList.filter(
          (e) => e !== "Hours must be greater than 0"
        );
      }
    }

    if (e.target.name === "hours" && e.target.value && isNaN(e.target.value)) {
      if (!errorList.includes("Hours must be a number")) {
        errorList.push("Hours must be a number");
      }
    } else {
      if (e.target.name === "hours") {
        errorList = errorList.filter((e) => e !== "Hours must be a number");
      }
    }

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) return;
    if (errorList.length) return;

    await editCourseHandler(courseData.id, form);
  };

  return (
    <div className="form-container-editCourse">
      <h4 className="green-text alignCenter-text bold-text form-title">
        Edit Course
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
        <div className="d-flex gap-3">
          <div className="form-group" style={{ width: "80%" }}>
            <label
              htmlFor="image"
              style={{ padding: "0 6px" }}
              className="green-text bold-text d-flex justify-content-between"
            >
              <span>Image</span>
              {form.image && (
                <span
                  className="EditCourse-Reset-Image-Button"
                  onClick={() => {
                    setForm({ ...form, image: null });
                  }}
                >
                  Reset
                </span>
              )}
            </label>
            <div className="AddCourse-Image-Button-frame">
              <Button
                disabled={!!form.image}
                className="m-auto"
                onClick={() => {
                  document.getElementById("image").click();
                }}
                variant="outlined"
              >
                {form.image ? "Image Added" : "Choose Image"}
              </Button>
              <input
                onChange={handleChange}
                style={{ padding: "10px" }}
                disabled={form.image}
                hidden
                onClick={(e) => {
                  if (e.pageX !== 0) {
                    e.preventDefault();
                  }
                }}
                type="file"
                id="image"
                name="image"
              />
            </div>
          </div>
          <div className="form-group w-100">
            <label htmlFor="hours" className="green-text bold-text">
              Hours
            </label>
            <input
              onChange={handleChange}
              value={form.hours}
              type="number"
              className="flex-grow-1"
              id="hours"
              name="hours"
              required
            />
          </div>
        </div>
        <div className="d-flex flex-column justify-content-between mt-2 mb-2">
          <button
            className="btn AddCourseButton"
            disabled={
              errorList.length > 0 || !form.title || !form.desc || !form.hours
            }
            type="submit"
          >
            Save
          </button>
          <button
            className="btn btn-outline-danger CancelButton"
            onClick={() => {
              showEditFormHandler();
              errorList = [];
            }}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourseForm;
