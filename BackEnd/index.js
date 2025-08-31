const express = require("express");
const path = require("path");
const app = express();
const ENV = require("../env");
const port = ENV.Back_Port;
const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 100000,
  max: 100000,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Middleware to parse JSON request bodies
app.use(express.json());

app.use(limiter);

const cors = require("cors");

const allowedOrigins = [ENV.Front_Origin];

// Middleware to allow requests from other origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins array
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve the static folder (e.g., 'static/courses' where the images are stored)

app.use("/static", express.static(path.join(__dirname, "static")));

app.use((req, res, next) => {
  if (req.url.endsWith(".pdf")) {
    res.setHeader("Content-Type", "application/pdf");
  }
  next();
});

// Importing routers
const UserRouter = require("./router/UserRouter");
const CourseRouter = require("./router/CourseRouter");
const PostRouter = require("./router/PostRouter");
const CommentRouter = require("./router/commentRouter");
const AssignmentRouter = require("./router/AssignmentRouter");
const ExamRouter = require("./router/ExamRouter");
const UnitRouter = require("./router/UnitRouter");

// Middleware to monitor requests and responses
app.use((req, res, next) => {
  console.log();
  console.warn("------------------------------------------------------");
  console.log(`Request URL: ${req.url}, Request Method: ${req.method}`);
  console.warn("------------------------------------------------------");
  console.log();
  next();
});

// Linking routers to the app
app.use(UserRouter);
app.use(CourseRouter);
app.use(PostRouter);
app.use(CommentRouter);
app.use(AssignmentRouter);
app.use(ExamRouter);
app.use(UnitRouter);

// Middleware to catch any errors
app.use((err, req, res, _) => {
  console.warn("------------------------------------------------------");
  console.error(err);
  console.warn("------------------------------------------------------");
  console.log();
  res.end();
});

// Middleware to catch any requests to non-existing routes
app.all("*", (req, res) => {
  return res.status(200).json({ error: "Wrong Path" });
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
