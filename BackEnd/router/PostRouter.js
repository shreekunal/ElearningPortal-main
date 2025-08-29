const { Router } = require("express");
const Controller = require("../controller/Post");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post("/createPost/:id", verifyToken(), Controller.createPost); //verified
router.post("/getPosts/:id", verifyToken(), Controller.getPosts); //verified
router.put("/updatePost/:userId", verifyToken(), Controller.updatePost); //verified
router.delete("/deletePost", verifyToken(), Controller.deletePost); //verified
module.exports = router;
