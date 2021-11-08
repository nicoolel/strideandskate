const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

// multer is a middleware that handles file uploads
router.post("/createPost", upload.single("file"), postsController.createPost);

// :id is the object id from document - we can change it and update the controller
// go to post controller and go to likePost method
router.put("/likePost/:id", postsController.likePost);

router.put("/dislikePost/:id", postsController.dislikePost);

router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
