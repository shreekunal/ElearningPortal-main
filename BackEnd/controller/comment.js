const {
  Comment,
  User,
  Post,
  Course,
  Student_Course,
  Instructor_Course,
} = require("../db/Database");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createComment: async (req, res, next) => {
    try {
      const { creatorId } = req.params;
      const { postID, content } = req.body;
      if (!creatorId || creatorId === "") {
        return res.status(200).json({ error: "Creator ID is required" });
      }
      if (!postID || postID === "") {
        return res.status(200).json({ error: "Post ID is required" });
      }
      if (!content || content === "") {
        return res.status(200).json({ error: "Comment is required" });
      }
      const user = await User.findOne({ id: creatorId });
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }
      const post = await Post.findOne({ id: postID });
      if (!post) {
        return res.status(200).json({ error: "Post not found" });
      }
      const PostCourse = await Course.findOne(post.courseId);
      if (
        user.role.toLowerCase() !== "admin"
      ) {
        if (user.role.toLowerCase() === "student") {
          const userCourses = await Student_Course.find({
            studentID: user._id,
            courseID: PostCourse._id,
          });
          if (userCourses.length === 0) {
            return res.status(200).json({ error: "User not authorized!" });
          }
        }
        if (user.role.toLowerCase() === "instructor") {
          const userCourses = await Instructor_Course.find({
            instructorID: user._id,
            courseID: PostCourse._id,
          });
          if (userCourses.length === 0) {
            return res.status(200).json({ error: "User not authorized!" });
          }
        }
      }

      const newComment = new Comment({
        id: uuidv4(),
        postID: post._id,
        content,
        creatorId: user._id,
      });
      newComment.save();
      res.status(201).json({ message: "Comment created successfully" });
    } catch (error) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Create Comment Function => ${error}`);
    }
  },

  updateComment: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { commentId, content } = req.body;
      if (!userId || userId === "") {
        return res.status.send(200, "user ID is required");
      }
      if (!commentId || commentId === "") {
        return res.status(200).json({ error: "comment ID is required" });
      }
      if (!content || content === "") {
        return res.status(200).json({ error: "Content is required" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(200).json({ error: "User is not found!" });
      }
      const comment = await Comment.findOne({ id: commentId });
      const commentCreator = await User.findOne({ _id: comment.creatorId });
      if (commentCreator.id !== user.id) {
        return res.status(200).json({ error: "User not authorized" });
      }
      comment.editedAt = Date.now();
      comment.content = content;
      comment.isEdited = true;
      await comment.save();
      res.status(201).json({ message: "Comment updated successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Update Comment Function => ${err}`);
    }
  },

  deleteComment: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { commentId } = req.body;
      if (!userId || userId === "") {
        return res.status(200).json({ error: "user ID is required" });
      }
      if (!commentId || commentId === "") {
        return res.status(200).json({ error: "comment ID is required" });
      }
      const user = await User.findOne({ id: userId });
      const comment = await Comment.findOne({ id: commentId });
      const commentCreator = await User.findOne({ _id: comment.creatorId });
      if (user.id !== commentCreator.id) {
        return res.status(200).json({ error: "user not authorized" });
      }
      await Comment.deleteOne({ id: commentId });
      res.status(201).json({ message: "Comment deleted successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Update Comment Function => ${err}`);
    }
  },

  getComments: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { postId } = req.body;
      if (!userId || userId === "") {
        return res.status.send(200, "user ID is required");
      }
      if (!postId || postId === "") {
        return res.status.send(200, "post ID is required");
      }
      const post = await Post.findOne({ id: postId });
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status.send(200, "user is not found!");
      }
      if (!post) {
        return res.status.send(200, "post is not found!");
      }
      const PostCourse = await Course.findOne(post.courseId);
      if (
        user.role.toLowerCase() !== "admin"
      ) {
        if (user.role.toLowerCase() === "student") {
          const userCourses = await Student_Course.find({
            studentID: user._id,
            courseID: PostCourse._id,
          });
          if (userCourses.length === 0) {
            return res.status(200).json({ error: "User not authorized!" });
          }
        }
        if (user.role.toLowerCase() === "instructor") {
          const userCourses = await Instructor_Course.find({
            instructorID: user._id,
            courseID: PostCourse._id,
          });
          if (userCourses.length === 0) {
            return res.status(200).json({ error: "User not authorized!" });
          }
        }
      }
      const comments = await Comment.find({ postID: post._id });
      res.status(201).json({ comments });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Update Comment Function => ${err}`);
    }
  },
};
