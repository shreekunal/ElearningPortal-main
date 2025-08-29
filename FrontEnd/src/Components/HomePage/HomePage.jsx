import { useState, useContext } from "react";
import "./HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CurrentUserContext } from "../../App";
import { NavLink } from "react-router-dom";
import CoursePlaceHolder from "../../assets/Course_Placeholder.svg";

const HomePage = () => {
  const { courses, isAuthenticated } = useContext(CurrentUserContext);

  const features = [
    {
      icon: "📚",
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of experience",
    },
    {
      icon: "🎯",
      title: "Interactive Learning",
      description: "Engage with quizzes, assignments, and hands-on projects",
    },
    {
      icon: "⚡",
      title: "Fast-Track Progress",
      description:
        "Accelerated learning paths designed for quick skill development",
    },
    {
      icon: "🏆",
      title: "Certified Programs",
      description: "Earn recognized certificates upon course completion",
    },
  ];

  const stats = [
    { number: "10K+", label: "Students" },
    { number: "500+", label: "Courses" },
    { number: "100+", label: "Instructors" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <div className="modern-home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transform Your Future with
              <span className="brand-highlight"> Shiksha Samarth</span>
            </h1>
            <p className="hero-description">
              Discover world-class courses, learn from industry experts, and
              advance your career with our comprehensive learning platform.
            </p>
            <div className="hero-buttons">
              {!isAuthenticated ? (
                <>
                  <NavLink to="/signup" className="btn-primary-custom">
                    Get Started Free
                  </NavLink>
                  <NavLink to="/courses" className="btn-secondary-custom">
                    Explore Courses
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/courses" className="btn-primary-custom">
                    Browse Courses
                  </NavLink>
                  <NavLink to="/MyCourses" className="btn-secondary-custom">
                    My Learning
                  </NavLink>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-content">
                <div className="course-icon">💻</div>
                <h4>Web Development</h4>
                <p>Master modern web technologies</p>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-content">
                <div className="course-icon">📊</div>
                <h4>Data Science</h4>
                <p>Analytics & Machine Learning</p>
                <div className="progress-bar">
                  <div className="progress-fill fill-80"></div>
                </div>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-content">
                <div className="course-icon">🎨</div>
                <h4>UI/UX Design</h4>
                <p>Create beautiful user experiences</p>
                <div className="progress-bar">
                  <div className="progress-fill fill-60"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Shiksha Samarth?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Courses Section */}
      {courses && courses.length > 0 && (
        <section className="courses-section">
          <div className="container">
            <h2 className="section-title">Popular Courses</h2>
            <div className="courses-grid">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="modern-course-card">
                  <div className="course-image">
                    <img
                      src={course.image || CoursePlaceHolder}
                      alt={course.title}
                      onError={(e) => {
                        e.target.src = CoursePlaceHolder;
                      }}
                    />
                    <div className="course-overlay">
                      <NavLink
                        to={`/CourseDetails/${course.id}`}
                        className="view-course-btn"
                      >
                        View Course
                      </NavLink>
                    </div>
                  </div>
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>
                      {course.description?.substring(0, 100) ||
                        "Enhance your skills with this comprehensive course"}
                      ...
                    </p>
                    <div className="course-meta">
                      <span className="course-category">
                        {course.category || "General"}
                      </span>
                      <span className="course-level">Beginner</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <NavLink to="/courses" className="btn-outline-custom">
                View All Courses
              </NavLink>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>
              Join thousands of learners who are already advancing their careers
              with Shiksha Samarth
            </p>
            {!isAuthenticated ? (
              <NavLink to="/signup" className="btn-cta">
                Start Learning Today
              </NavLink>
            ) : (
              <NavLink to="/courses" className="btn-cta">
                Continue Learning
              </NavLink>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
