import React, { useContext, useState } from "react";
import "./AddCourseForm.css";
import { CurrentUserContext } from "../../App.jsx";
import { v4 } from "uuid";
import { Button } from "@mui/material";
import { getCookie } from "../Cookie/Cookie.jsx";
import Front_ENV from "../../../Front_ENV.jsx";
import Loader from "../Loader/Loader.jsx";

let errorList = [];

const AddCourseForm = ({ showFormHandler }) => {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    hours: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const { showMessage, setCourses, fetchCourses } =
    useContext(CurrentUserContext);

  const addHandler = async (newCourse) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", newCourse.title);
    formData.append("desc", newCourse.desc);
    formData.append("hours", newCourse.hours);
    formData.append("image", newCourse.image); // Attach the image file

    const response = await fetch(`${Front_ENV.Back_Origin}/create-course`, {
      method: "POST",
      headers: {
        authorization: getCookie("token") || "", // Keep the authorization header
      },
      body: formData, // Send form data (which includes the image file)
    }).then((response) => response.json());

    if (response.error) {
      showMessage(response.error, true);
      return;
    }

    setLoading(false);

    setCourses((prevState) => {
      return [...prevState, response.data];
    });

    showMessage(response.message, false);
    showFormHandler();
    // Refresh courses list to ensure we have the latest data
    fetchCourses();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      // validate image size (maximum => 3mb) & type
      if (files[0].size > 1024 * 1024 * 3) {
        showMessage("Image size exceeds 3MB", true);
        return;
      }
      if (!files[0].type.startsWith("image")) {
        showMessage("Invalid image file", true);
        return;
      }
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }

    // Validation logic...
    if (name === "hours" && value && value < 1) {
      if (!errorList.includes("Hours must be greater than 0")) {
        errorList.push("Hours must be greater than 0");
      }
    } else {
      if (name === "hours") {
        errorList = errorList.filter(
          (e) => e !== "Hours must be greater than 0"
        );
      }
    }

    if (name === "hours" && value && isNaN(value)) {
      if (!errorList.includes("Hours must be a number")) {
        errorList.push("Hours must be a number");
      }
    } else {
      if (name === "hours") {
        errorList = errorList.filter((e) => e !== "Hours must be a number");
      }
    }

    if (name === "title" && value && !isNaN(value)) {
      if (!errorList.includes("Title must be a string")) {
        errorList.push("Title must be a string");
      }
    } else {
      if (name === "title") {
        errorList = errorList.filter((e) => e !== "Title must be a string");
      }
    }

    if (name === "desc" && value && !isNaN(value)) {
      if (!errorList.includes("Description must be a string")) {
        errorList.push("Description must be a string");
      }
    } else {
      if (name === "desc") {
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

    const { title, desc, hours, image } = form;
    await addHandler({ title, desc, hours, image });
  };

  return (
    <div className="form-container-addCourse">
      <h4 className="green-text alignCenter-text bold-text form-title">
        Add Course
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
      {loading ? (
        <div className="d-flex align-items-center" style={{ height: "453px" }}>
          <Loader />
        </div>
      ) : (
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
                    className="AddCourse-Reset-Image-Button"
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
                  accept={"image/*"}
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
                errorList.length || !form.hours || !form.desc || !form.title
              }
              type="submit"
            >
              Add
            </button>
            <button
              className="btn btn-outline-danger CancelButton"
              onClick={() => {
                showFormHandler();
                errorList = [];
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddCourseForm;
