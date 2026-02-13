const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signUp", (req, res) => {
    res.render("users/signUp.ejs");
});
router.post("/signUp", wrapAsync(async(req,res)=>{
    try{
   let {username,email,password} = req.body;
   const newuser = new User({email,username});
   const registeredUser = await User.register(newuser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","Welcome to WanderNest!");
    res.redirect("/listings");
   });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    }
   
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),async(req,res)=>{
    req.flash("success","Welcome back!");
    res.redirect(res.locals.redirectUrl);
});
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out now!");
        res.redirect("/listings");
    });
});
module.exports = router;