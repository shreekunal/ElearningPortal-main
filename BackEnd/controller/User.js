const {
  User,
  Course,
} = require("../db/Database");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Secret_Key } = require("../../env");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { jwtDecode } = require("jwt-decode");

// Email configuration (you might want to use environment variables for this)
const transporter = nodemailer.createTransport({
  service: "gmail", // Or any other email provider
  auth: {
    user: "e.learning.system.depi@gmail.com", // Replace with your email
    pass: "gxeqtzwcqhhmfzhf", // Replace with your email password or app-specific password
  },
});

function emailAcceptance(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function passwordAcceptance(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(String(password));
}

function usernameAcceptance(username) {
  const re = /^(?=.*[a-z])[a-z0-9_]{4,}$/;
  return re.test(String(username));
}

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate the username
    if (!username) {
      return res.status(200).json({ error: "Username is required" });
    }
    // Validate the password
    if (!password) {
      return res.status(200).json({ error: "Password is required" });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ error: "Invalid username" });
    } else if (!(await bcrypt.compare(password, user.password))) {
      return res.status(200).json({ error: "Invalid password" });
    } else {
      const token = await jwt.sign(
        {
          name: user.name,
          username: user.username,
          id: user.id,
          role: user.role,
          gender: user.gender,
          email: user.email,
        },
        Secret_Key,
        { expiresIn: "1h" }
      );
      res.status(201).json({ message: `Welcome ${user.name}`, data: token });
    }
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: login function => ${error}`);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    res.status(201).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: Logout Function => ${err}`);
  }
};

module.exports.register = async (req, res, next) => {
  //userId is the admin id
  try {
    const { name, gender, email, username, password, role, userId } = req.body;
    const id = uuidv4();
    const validEmail = emailAcceptance(email);
    const validPassword = passwordAcceptance(password);
    const validUsername = usernameAcceptance(username);

    if (!validEmail) {
      return res.status(200).json({ error: "Invalid email format" });
    }

    if (!validPassword) {
      return res.status(200).json({ error: "Password must be at least 8 characters long, include a number, a special character (@$!%*?&), an uppercase letter and a lowercase letter" });
    }

    if (!validUsername) {
      return res.status(200).json({ error: "Invalid username" });
    }

    if (await User.findOne({ username: username })) {
      return res.status(200).json({ error: "Username already exists" });
    }

    if (await User.findOne({ email: email })) {
      return res.status(200).json({ error: "Email already exists" });
    }

    if (!role) {
      return res.status(200).json({ error: "Role is required" });
    }

    if (!["Student", "Instructor", "Admin"].includes(role)) {
      return res.status(200).json({ error: "Invalid role" });
    }

    const admin = await User.findOne({ role: "Admin", id: userId });
    if (userId && admin) {
      if (["Student", "Instructor"].includes(admin.role)) {
        return res.status(200).json({ error: "Unauthorized action" });
      }
    }

    if (!userId && role !== "Student") {
      return res.status(200).json({ error: "Unauthorized action" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      id,
      gender,
      email,
      username,
      password: hashedPassword,
      role,
    });

    await user.save();
    role === "Instructor" ?
      res.status(201).json({ message: `Instructor (${user.name}) Added Successfully` })
      :
      res.status(201).json({ message: `User (${user.name}) registered successfully` })
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: Register function => ${error}`);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const { role, courseID } = req.query;
    if (role && (role === "Admin" || role === "Student" || role === "Instructor")) {

      if (role === "Instructor" && courseID) {
        let course = await Course.findOne({ id: courseID });

        if (!course) {
          return res.status(200).json({ error: "Course not found" });
        }

        let users = await User.aggregate([
          {
            $match: { role: "Instructor" }
          },
          {
            $lookup: {
              from: "instructor_courses",
              localField: "_id",
              foreignField: "instructorID",
              as: "assignedCourses"
            }
          },
          {
            $addFields: {
              isAssigned: {
                $cond: {
                  if: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$assignedCourses",
                            as: "course",
                            cond: { $eq: ["$$course.courseID", new mongoose.Types.ObjectId(course._id)] }
                          }
                        }
                      },
                      0
                    ]
                  },
                  then: true,
                  else: false
                }
              }
            }
          },
          {
            $project: {
              id: 1,
              name: 1,
              gender: 1,
              email: 1,
              username: 1,
              role: 1,
              isAssigned: 1
            }
          }
        ]);

        return res.status(201).json({ data: users });
      }

      let users = await User.find({ role });
      users = users.map(({ id, name, gender, email, username, role }) => {
        return {
          id,
          name,
          gender,
          email,
          username,
          role
        }
      });

      return res.status(201).json({ data: users });
    } else if (role) {
      return res.status(200).json({ error: "Invalid role" });
    }

    const users = await User.find();
    res.status(201).json({ data: users });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getUsers function => ${error}`);
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, isedit } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set the token expiry time (e.g., 1 hour from now)
    const tokenExpiry = Date.now() + (1000 * 60 * 10); // 10 minutes

    // Save the token and expiry to the user record (you might need to modify your User model)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    // Construct the password reset URL
    const resetUrl = `http://localhost:5173/resetPassword/?token=${resetToken}`;

    if (isedit) {
      return res.status(201).json({ data: { resetToken } });
    }

    // Send the password reset email
    const mailOptions = {
      from: "DEPI.graduationProject@outlook.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link to complete the process within one hour of receiving it:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: forgotPassword function => ${error}`);
  }
};

module.exports.verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (token && token.toLowerCase() === "null") {
      return res.status(200).json({ error: "Password reset token is required" });
    }

    const user =
      await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    const userResetToken =
      await User.findOne({ resetPasswordToken: token });

    if (userResetToken && Date.now() > userResetToken.resetPasswordExpires) {
      return res.status(200).json({ error: "Password reset token has expired" });
    }
    if (!user) {
      return res.status(200).json({ error: "Password reset token is invalid" });
    } else {
      res.status(201).json({ message: "Password reset token is valid" });
    }
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: verifyResetToken function => ${error}`);
  }
}

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { oldpassword, password, mode } = req.body;

    // Find the user by the reset token and ensure the token hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token hasn't expired
    });

    if (!user) {
      return res
        .status(200)
        .json({ error: "Password reset token is invalid or has expired" });
    }

    if (mode === "ChangePassword") { // Validate the old password ONLY
      const isValidOldPassword = await bcrypt.compare(oldpassword, user.password);
      if (!isValidOldPassword) {
        return res.status(200).json({ error: "Invalid old password provided" });
      }
    }

    // Hash the new password
    const isValid = passwordAcceptance(password);
    if (!isValid) {
      return res.status(200).json({ error: "Invalid password" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token and expiry
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(201).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: resetPassword function => ${error}`);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params; // Use req.params instead of req.body
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Use 404 status for not found
    }
    res.status(200).json({ data: user }); // Use 200 status for successful retrieval
  } catch (error) {
    res.status(500).json({ error: "Unexpected Error Occurred" }); // Use 500 status for server error
    next(`ERROR IN: getUser function => ${error}`);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ id: id });

    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }
    res.status(201)
      .json({ message: `User (${user.name}) deleted successfully` });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" }); // Use 500 status for server error
    next(`ERROR IN: deleteUser function => ${error}`);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sentUser = req.body;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    const checkUsername = await User.findOne({ username: sentUser.username });
    if (checkUsername && checkUsername.id !== id) {
      return res.status(200).json({ error: "Username already exists" });
    }

    const checkEmail =
      await User.findOne({ email: sentUser.email });
    if (checkEmail && checkEmail.id !== id) {
      return res.status(200).json({ error: "Email already exists" });
    }

    user.name = sentUser.name;
    user.email = sentUser.email;
    user.username = sentUser.username;

    await user.save();
    const token = await jwt.sign(
      sentUser,
      Secret_Key
    )

    res.status(201).json({
      message: `User (${user.name}) updated successfully`,
      data: token
    });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: updateUser function => ${error}`);
  }
};
