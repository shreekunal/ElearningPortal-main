import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../App";
import Front_ENV from "../../../Front_ENV.jsx";
import { getCookie } from "../Cookie/Cookie.jsx";
import "./CourseBlog.css";

const CourseBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, showMessage } = useContext(CurrentUserContext);
  const [course, setCourse] = useState(null);
  const [posts, setPosts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
    fetchCoursePosts();
    fetchCourseMaterials();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`${Front_ENV.Back_Origin}/getCourse/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      });
      const data = await response.json();
      if (data.data) {
        setCourse(data.data);
      } else {
        showMessage(data.error || "Course not found", true);
        navigate("/MyCourses");
      }
    } catch (error) {
      showMessage("Error fetching course details", true);
      navigate("/MyCourses");
    }
  };

  const fetchCoursePosts = async () => {
    try {
      const response = await fetch(`${Front_ENV.Back_Origin}/get-posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      });
      const data = await response.json();
      if (data.data) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchCourseMaterials = async () => {
    try {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/get-materials/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: getCookie("token") || "",
          },
        }
      );
      const data = await response.json();
      if (data.data) {
        setMaterials(data.data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading course...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  return (
    <div className="course-blog-container">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.desc}</p>
        <div className="course-info">
          <span>{course.hours} Hours</span>
          <span>{course.numStudents} Students Enrolled</span>
        </div>
      </div>

      <div className="course-content">
        <div className="content-section">
          <h2>📚 Course Materials</h2>
          {materials.length > 0 ? (
            <div className="materials-list">
              {materials.map((material, index) => (
                <div key={index} className="material-item">
                  <h3>{material.title}</h3>
                  <p>{material.description}</p>
                  {material.file && (
                    <a
                      href={`${Front_ENV.Back_Origin}${material.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="material-link"
                    >
                      📄 View Material
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-content">No materials available yet.</p>
          )}
        </div>

        <div className="content-section">
          <h2>📢 Announcements</h2>
          {posts.length > 0 ? (
            <div className="posts-list">
              {posts.map((post, index) => (
                <div key={index} className="post-item">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <div className="post-date">
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-content">No announcements yet.</p>
          )}
        </div>

        {currentUser.role === "Instructor" && (
          <div className="instructor-actions">
            <h2>⚙️ Instructor Actions</h2>
            <div className="action-buttons">
              <button
                className="action-button"
                onClick={() => navigate(`/AddMaterial/${id}`)}
              >
                Add Material
              </button>
              <button
                className="action-button"
                onClick={() => navigate(`/AddAnnouncement/${id}`)}
              >
                Add Announcement
              </button>
              <button
                className="action-button"
                onClick={() => navigate(`/CourseDetails/${id}`)}
              >
                Manage Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBlog;
