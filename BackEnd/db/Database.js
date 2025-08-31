const { v4 } = require("uuid");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Database_URI } = require("../../env");

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(Database_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Connected to MongoDB (Online - Cloud)");
  } catch (e) {
    throw new Error("Error connecting to MongoDB (Online - Cloud)");
  }
}

run().catch(e => console.error(e));

// Connect to MongoDB (Local)
// mongoose
//   .connect("mongodb://localhost:27017/e-learning")
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log(err));

// Create the User model
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      id: { type: String, required: true },
      gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
      },
      email: { type: String, required: true },
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: {
        type: String,
        enum: ["Admin", "Instructor", "Student"],
        required: true,
      },
      resetPasswordToken: String,
      resetPasswordExpires: Date,
    },
    { timestamps: true }
  )
);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema(
    {
      title: { type: String, required: true, unique: true },
      desc: { type: String, required: true },
      id: { type: String, required: true, unique: true },
      hours: { type: Number, required: true },
      image: { type: String },
    },
    { timestamps: true }
  )
);

const Student_Course = mongoose.model(
  "Student_Course",
  new mongoose.Schema(
    {
      studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      duration: { type: Number, required: true }, // In months
    },
    { timestamps: true }
  )
);

const Instructor_Course = mongoose.model(
  "Instructor_Course",
  new mongoose.Schema(
    {
      instructorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      duration: { type: Number, required: true }, // In months
    },
    { timestamps: true }
  )
);

const Session = mongoose.model(
  "Session",
  new mongoose.Schema(
    {
      token: { type: String, required: true },
      createDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
  )
);

const Exam = mongoose.model(
  "Exam",
  new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      title: { type: String, required: true },
      startDate: { type: Date, required: true },
      duration: { type: Number, required: true }, // Duration in minutes
      endDate: { type: Date, required: true },
      description: { type: String },
    },
    { timestamps: true }
  )
);

const Question = mongoose.model(
  "Question",
  new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      answers: { type: [String], required: true },
      correctAnswer: { type: String, required: true },
      examID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
      },
    },
    { timestamps: true }
  )
);

const Assignment = mongoose.model(
  "Assignment",
  new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      startDate: { type: Date, required: true },
      duration: { type: Number, required: true }, // Duration in hours
      endDate: { type: Date, required: true },
      title: { type: String, required: true },
      description: { type: String },
      document: { type: String },
    },
    { timestamps: true }
  )
);

const AssignmentAnswer = mongoose.model(
  "AssignmentAnswer",
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    document: { type: String, required: true },
    assignmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grade: { type: Number },
  })
);

const StudentExam = mongoose.model(
  "StudentExam",
  new mongoose.Schema(
    {
      examID: {
        type: String,
        ref: "Exam",
        required: true,
      },
      studentID: {
        type: String,
        ref: "User",
        required: true,
      },
      grade: { type: Number, required: true },
    },
    { timestamps: true }
  )
);

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    announcement: { type: String, required: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date, default: null },
    isEdited: { type: Boolean, default: false },
  })
);

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: { type: String, required: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date, default: null },
    isEdited: { type: Boolean, default: false },
  })
);

const Reply = mongoose.model(
  "Reply",
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    commentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    content: { type: String, required: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date, default: null },
  })
);

const Unit = mongoose.model(
  "Unit",
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    chapters: [{
      id: { type: Number, required: true },
      title: { type: String, required: true },
      sections: [{
        id: { type: Number, required: true },
        heading: { type: String, required: true },
        content: { type: String, default: "" },
        subSections: [{
          id: { type: Number, required: true },
          subHeading: { type: String, default: "" },
          subContent: { type: String, default: "" },
        }]
      }],
      videoUrl: { type: String, default: "" },
      materials: { type: String, default: "" },
    }],
    quiz: {
      title: { type: String, required: true },
      questions: [{
        id: { type: Number, required: true },
        question: { type: String, required: true },
        type: { type: String, default: "multiple-choice" },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true },
      }]
    },
    isActive: { type: Boolean, default: true },
  }, { timestamps: true })
);

//--------------------------------------------

module.exports = {
  User,
  Course,
  Student_Course,
  Instructor_Course,
  Session,
  Question,
  Exam,
  Assignment,
  AssignmentAnswer,
  StudentExam,
  Post,
  Comment,
  Reply,
  Unit,
};
