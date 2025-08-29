const { Router } = require("express");
const Controller = require("../controller/comment");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post(
  "/createComment/:creatorId",
  verifyToken(),
  Controller.createComment
);
router.get("/getComments/:userId", verifyToken(), Controller.getComments); 
router.put("/updateComment/:userId", verifyToken(), Controller.updateComment); 
router.delete(
  "/deleteComment/:userId",
  verifyToken(),
  Controller.deleteComment
); 
module.exports = router;
