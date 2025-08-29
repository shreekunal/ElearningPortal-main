const { Router } = require("express");
const Controller = require("../controller/User");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post("/login", Controller.login); // verified front and back
router.post("/logout", Controller.logout); // verified front and back
router.post("/register", Controller.register); // verified front and back
router.get("/getUser", verifyToken("Admin"), Controller.getUser); // for admin
router.get("/getUsers", verifyToken("Admin"), Controller.getUsers);
router.put("/updateUser/:id", verifyToken(), Controller.updateUser);
router.delete("/deleteUser/:id", verifyToken("Admin"), Controller.deleteUser);
router.post("/forgotPassword", Controller.forgotPassword); // verified front and back

// Reset password route
router.post("/resetPassword/:token", Controller.resetPassword); // verified front and back
router.post("/verifyRestToken/:token", Controller.verifyResetToken); // verified front and back

module.exports = router;
