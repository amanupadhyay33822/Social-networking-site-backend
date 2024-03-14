const express = require('express');
const { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, getPostsByUser, updatePost, getLatestPostsFromFollowing } = require('../controllers/post');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.post("/post/upload",isAuthenticated ,createPost)
router.get("/post/:id",isAuthenticated , likeAndUnlikePost);
router.delete("/post/:id",isAuthenticated , deletePost);
router.get("/post",isAuthenticated ,getPostOfFollowing);

router.get("/posts/:userId", isAuthenticated,getPostsByUser);
router.put("/posts/:postId",isAuthenticated, updatePost);

router.get("/latest-posts", isAuthenticated, getLatestPostsFromFollowing);

module.exports = router;