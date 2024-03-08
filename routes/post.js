const express = require('express');
const { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing } = require('../controllers/post');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.post("/post/upload",isAuthenticated ,createPost)
router.get("/post/:id",isAuthenticated , likeAndUnlikePost);
router.delete("/post/:id",isAuthenticated , deletePost);
router.get("/post",isAuthenticated ,getPostOfFollowing);



module.exports = router;