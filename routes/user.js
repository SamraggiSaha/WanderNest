const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require('../controllers/user.js');

router.get("/signUp", UserController.RenderSignUpForm);

router.post("/signUp", wrapAsync(UserController.signUp));

router.get("/login", UserController.RenderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),UserController.login);

router.get("/logout",UserController.logout);

module.exports = router;