const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const {isLoggedin , isOwner} = require('../middleware.js');
const {validateListing} = require('../middleware.js');
const ListingController = require('../controllers/listing.js');
//Index route
router.get("/", wrapAsync(ListingController.index));
//New route
router.get("/new",isLoggedin,(req,res)=>{
    res.render("listings/new.ejs",{listing:{}});
});
router.post("/",validateListing,isLoggedin,wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New listing Created Successfully");
    res.redirect("/listings");
})
);
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",
        populate: {path: "author"}})
        .populate("owner");
    if(!listing){
        req.flash("error","Oops!Listing you requested does not exist");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));
//Edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Oops!Listing you requested does not exist");
       return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));
//update route
router.put("/:id",validateListing,isLoggedin,isOwner,wrapAsync(async(req,res)=>{
    if(! req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}));
router.delete("/:id",isLoggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
}));
module.exports = router;