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
const listings=require('./routes/listing.js')
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


app.get("/",(req,res)=>{
    res.send("working");
});

const validateReview=(req,res,next)=>{
let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}
 // app.get("/testlisting",async(req,res)=>{
    // let sampleListing = new Listing({
          // title:"My Villa",
                 //description:"A beautiful villa by the sea",
        //price:1200,
        //location:"Calangute,Goa",
       // country:"India",
    //});
    // await sampleListing.save();
    // console.log("Sample listing saved");
     //res.send("successful testing");
 //});
app.use("/listings",listings);
//review
//post review route 
app.post("/listings/:id/review",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    console.log(newReview);
    res.redirect(`/listings/${listing._id}`);
}));
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
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