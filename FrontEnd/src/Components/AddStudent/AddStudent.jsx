import React, { useContext, useState } from "react";
import "./AddStudent.css";
import { CurrentUserContext } from "../../App.jsx";
import { v4 } from "uuid";
import { useNavigate } from "react-router";
import Front_ENV from "../../../Front_ENV.jsx";
import { getCookie } from "../Cookie/Cookie.jsx";
import Loader from "../Loader/Loader.jsx";

let errorList = [];

const AddStudent = () => {
  const [form, setForm] = useState({
    name: "",
    id: "",
    gender: "",
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { showMessage } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const addHandler = async (newStudent) => {
    setLoading(true);
    const response = await fetch(`${Front_ENV.Back_Origin}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: getCookie("token") || "",
      },
      body: JSON.stringify({ ...newStudent, role: "Student" }),
    }).then((response) => response.json());

    setLoading(false);

    if (response.error) {
      showMessage(response.error, true);
      return;
    }

    showMessage(response.message, false);
    navigate("/StudentsPage");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validation logic
    if (name === "name" && value && !isNaN(value)) {
      if (!errorList.includes("Name must be a string")) {
        errorList.push("Name must be a string");
      }
    } else {
      if (name === "name") {
        errorList = errorList.filter((e) => e !== "Name must be a string");
      }
    }

    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        if (!errorList.includes("Invalid email format")) {
          errorList.push("Invalid email format");
        }
      } else {
        errorList = errorList.filter((e) => e !== "Invalid email format");
      }
    }

    if (name === "password" && value) {
      if (value.length < 6) {
        if (!errorList.includes("Password must be at least 6 characters")) {
          errorList.push("Password must be at least 6 characters");
        }
      } else {
        errorList = errorList.filter(
          (e) => e !== "Password must be at least 6 characters"
        );
      }
    }

    if (name === "username" && value) {
      if (value.length < 3) {
        if (!errorList.includes("Username must be at least 3 characters")) {
          errorList.push("Username must be at least 3 characters");
        }
      } else {
        errorList = errorList.filter(
          (e) => e !== "Username must be at least 3 characters"
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) return;
    if (errorList.length) return;

    const studentData = {
      ...form,
      id: v4(),
    };

    await addHandler(studentData);
  };

  return (
    <div className="add-student-container">
      <div className="add-student-header">
        <h1>Add New Student</h1>
        <p>Create a new student account</p>
      </div>

      {errorList.length > 0 && (
        <div className="alert alert-danger">
          {errorList.map((error, index) => (
            <div key={index}>
              <span style={{ fontSize: "17px" }}>∗</span> {error}
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <form className="add-student-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                onChange={handleChange}
                value={form.name}
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                onChange={handleChange}
                value={form.username}
                type="text"
                id="username"
                name="username"
                required
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={handleChange}
                value={form.email}
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                onChange={handleChange}
                value={form.gender}
                id="gender"
                name="gender"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              value={form.password}
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter password"
            />
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              disabled={
                errorList.length ||
                !form.name ||
                !form.username ||
                !form.email ||
                !form.gender ||
                !form.password
              }
              type="submit"
            >
              Add Student
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                navigate("/StudentsPage");
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

export default AddStudent;
