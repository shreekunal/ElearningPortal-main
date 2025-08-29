const { Secret_Key } = require("../../env");
const jwt = require("jsonwebtoken");
const { Session } = require("../db/Database");
const { verify } = require("jsonwebtoken");

// Middle ware to verify person if it is authorized or not to join route
const VerifyTokenForAdmin = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(200).json({ error: "You must login first" });
    next("ERROR IN: VerifyTokenForAdmin function => Token is required");
    return;
  }

  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role === "admin") {
      req.user = decoded;
      next();
    } else {
      res.status(200).json({ error: "You are not authorized" });
      next("ERROR IN: VerifyTokenForAdmin function => Invalid role");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(200).json({ error: "Session Expired, please login again" });
      await Session.deleteOne({});
    } else {
      res.status(200).json({ error: "Invalid credentials" });
    }
    next(`ERROR IN: VerifyTokenForAdmin function => ${error}`);
  }
};

const VerifyTokenForInstructor = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(200).json({ error: "You must login first" });
    next("ERROR IN: VerifyTokenForInstructor function => Token is required");
    return;
  }

  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role === "instructor" || decoded.role === "admin") {
      req.user = decoded
      next();
    } else {
      res.status(200).json({ error: "You are not authorized" });
      next("ERROR IN: VerifyTokenForInstructor function => Invalid role");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(200).json({ error: "Session Expired, please login again" });
      await Session.deleteOne({});
    } else {
      res.status(200).json({ error: "Invalid credentials" });
    }
    next(`ERROR IN: VerifyTokenForInstructor function => ${error}`);
  }
};

const VerifyTokenForStudent = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(200).json({ error: "You must login first" });
    next("ERROR IN: VerifyTokenForStudent function => Token is required");
    return;
  }

  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role === "student" || decoded.role === "admin") {
      req.user = decoded;
      next();
    } else {
      res.status(200).json({ error: "You are not authorized" });
      next("ERROR IN: VerifyTokenForStudent function => Invalid role");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(200).json({ error: "Session Expired, please login again" });
      await Session.deleteOne({});
    } else {
      res.status(200).json({ error: "Invalid credentials" });
    }
    next(`ERROR IN: VerifyTokenForStudent function => ${error}`);
  }
};

const VerifyTokenForUser = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(200).json({ error: "You must login first" });
    next("ERROR IN: VerifyTokenForUser function => Token is required");
    return;
  }

  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role === "student" || decoded.role === "instructor" ||
      decoded.role === "admin") {
      req.user = decoded;
      next();
    } else {
      res.status(200).json({ error: "You are not authorized" });
      next("ERROR IN: VerifyTokenForUser function => Invalid role");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(200).json({ error: "Session Expired, please login again" });
      await Session.deleteOne({});
    } else {
      res.status(200).json({ error: "Invalid credentials" });
    }
    next(`ERROR IN: VerifyTokenForUser function => ${error}`);
  }
};

function verifyToken(role) {
  if (!role) {
    return VerifyTokenForUser;
  }
  role = role.toLowerCase().replaceAll(" ", "");
  if (role === "admin") {
    return VerifyTokenForAdmin;
  } else if (role === "instructor") {
    return VerifyTokenForInstructor;
  } else if (role === "student") {
    return VerifyTokenForStudent;
  }
}

module.exports = verifyToken;
