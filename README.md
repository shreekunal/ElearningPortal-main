# Shiksha Samarth

## 1. Introduction

This eLearning platform enables users to enroll in courses, submit assignments, and take exams. The platform supports three types of users: Students, Instructors, and Admins. Each role has distinct functionalities, ensuring the system is secure and efficient in managing courses and student progress.

## 2. Technology Stack

The platform is developed using the MERN stack along with additional tools like bcrypt for password encryption, express-rate-limiter for rate limiting, Vite for fast builds, Bootstrap, and Material-UI (MUI) for styling:

<h5>Frontend: React.js </h5> 
<h5>Build Tool: Vite</h5> 
<h5>Backend: Node.js with Express.js  </h5>
<h5>Database: MongoDB </h5> 
<h5>Authentication: JWT (JSON Web Token)</h5> 
<h5>Styling: Bootstrap </h5> 
<h5>Styling: Material-UI (MUI)</h5>
<p align="left" >
 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="50px" height="50px"/>
<img src="https://vitejs.dev/logo.svg" alt="Vite Logo" style="width:50px; height:50px;">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="50px" height="50px"/>&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" width="50px" height="50px"/>&nbsp;
<img src="https://jwt.io/img/pic_logo.svg" alt="JWT Logo" style="width:50px; height:50px;">&nbsp;&nbsp;
<img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg" alt="Bootstrap Logo" style="width:50px; height:50px;">&nbsp;
<img src="https://mui.com/static/logo.png" alt="Material-UI Logo" style="width:50px; height:50px;">

</p>
##3. User Roles and Permissions

### Student

- **Enroll in Courses**: Students can enroll in available courses.
- **Submit Assignments**: Students can upload their assignment submissions for each course as a pdf.
- **Solve Exams**: Students can participate in multiple-choice exams and submit answers.
- **View Deadlines**: Students can see upcoming deadlines for assignments and exams.
- **Track Progress**: Students can view their progress for each course they are enrolled in, including marks for assignments and exams.

### Instructor

- **Manage Course Materials**: Instructors can add, edit, and delete course materials, such as announcements, exams, and assignments.
- **Add MCQ Exams with Auto-Correction**: Instructors can create multiple-choice exams with model answers. The system automatically corrects student submissions and displays the marks.
- **Track Student Progress**: Instructors can view the progress of students enrolled in the courses they teach.

### Admin

- **Manage Courses**: Admins can add, edit, or delete courses from the system.
- **Manage Users**: Admins can remove students or instructors from the system.
- **Assign Instructors to Courses**: Admins can assign instructors to specific courses.
- **View Student Progress**: Admins can view the progress of all students in all courses.

## 4. Core Features

### Student Features

- **Course Enrollment**: Students can browse the course catalog and enroll in available courses.
- **Assignment Submission**: Students upload their completed assignments to be graded by the instructor.
- **Exam Participation**: Students can take exams, with MCQ exams being auto-corrected by the system.
- **Progress Tracking**: Students can view their marks and progress for every enrolled course.

### Instructor Features

- **Material Management**: Instructors can create and manage course materials, including assignments, exams, and announcements.
- **Auto-Graded Exams**: Instructors can upload MCQ exams along with correct answers for automatic grading.
- **View Student Progress**: Instructors can monitor the performance of students in the courses they are assigned.

### Admin Features

- **Course Management**: Admins can create, update, and delete courses.
- **User Management**: Admins can remove students or instructors from the system and assign instructors to courses.
- **Progress Monitoring**: Admins have access to the performance records of all students.

## 5. Backend Overview

### Authentication

- **JWT (JSON Web Token)**: All users are authenticated using JWT tokens, ensuring secure access to the platform's resources.
- **Email Verification & Password Reset**: Users can reset their passwords through email authentication. A UUID v4 token is generated and sent to the user’s email for password recovery.

## 6. Frontend Overview

The frontend is built using **React.js** with Material-UI and Bootstrap for component styling. Providing a user-friendly interface for navigating the platform. Each user role has a dedicated dashboard with role-specific features and actions.

## 7. Database Schema

The platform uses _MongoDB_ as the primary database, with the following collections:

- _Users_: Stores details about students, instructors, and admins.
- _Courses_: Stores course information, including the materials, exams, and student enrollment data.
- _Assignments_: Stores submitted assignments for each course.
- _Exams_: Stores MCQ exams and model answers.
- _Posts_: Stores the Announcements added by instructors

## 8. Local Development

To run this project locally:

1. Install dependencies: `npm install`
2. Start the development servers: `npm run dev`
3. Access the application at: `http://localhost:5173`
