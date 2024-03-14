const express = require("express");
const {
  register,
  login,
  followUser,
  logout,
  updatePassword,
  updateUser,
  viewUserProfile,
  deleteUserProfile,
  getFollowingAndFollowers,
} = require("../controllers/user");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/follow/:id", isAuthenticated, followUser);
router.post("/update", updateUser);
router.put('/user/update-password', isAuthenticated, updatePassword);
router.get("/user/:id", viewUserProfile);
router.delete("/delete/:id",isAuthenticated ,deleteUserProfile);
router.get("/followers-following/:userId", getFollowingAndFollowers);
// router.get("/logout",logout)
// router.put("/update/password",isAuthenticated, updatePassword)

module.exports = router;
