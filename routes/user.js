const express = require('express');
const { register, login, followUser, logout, updatePassword } = require('../controllers/user');
const { isAuthenticated } = require('../middleware/auth');


const router = express.Router();

router.post("/register", register);
router.post("/login",login)
router.get("/follow/:id",isAuthenticated,followUser)
// router.get("/logout",logout)
// router.put("/update/password",isAuthenticated, updatePassword)



module.exports = router;