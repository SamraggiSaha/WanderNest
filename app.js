const express=require('express');
const app=express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride=require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review= require('./models/review.js');
const listingRouter=require('./routes/listing.js')
const reviewRouter=require('./routes/review.js');
const userRouter = require('./routes/user.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/user.js');
const LocalStrategy = require('passport-local');
main().then(()=>{
    console.log("connected to db succesfully");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);

const sessionOptions = {
    secret:"mysecretsessioncode",
    resave:false,
    saveUnitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};
app.get("/",(req,res)=>{
    res.send("working");
});
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    console.log(res.locals.success);
    console.log(res.locals.error);
    res.locals.currentUser = req.user;
    next();
});
 // app.get("/testlisting",async(req,res)=>{
    // let sampleListing = new Listing({
            // title:"My Villa",
                 //description:"A beautiful villa by the sea",
        // price:1200,
        //location:"Calangute,Goa",
       // country:"India",
    //});
    //  await sampleListing.save();
    // console.log("Sample listing saved");
      // res.send("successful testing");
 // });
 //app.get("/userdemo",async(req,res)=>{
  //  const fakeUser = new User({
   //     email:"abcd@gmail.com",
    //    username:"abcd"
    //});
    //let registeredUser = await User.register(fakeUser,"helloo world");
    //console.log(registeredUser);
    //res.send(registeredUser);
 // });
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//review
//post review route 
app.all("/{*any}", (req, res, next) => { // Or use "/{*any}" for more explicit naming
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err,req,res,next)=>{
    const {statusCode=500,message = "Something went wrong !"} = err;
    res.status(statusCode).render("error.ejs",{err});
});
app.listen(8080, () => {
    console.log("Server running on port 8080");
});