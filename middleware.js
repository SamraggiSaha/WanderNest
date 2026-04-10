const Listing = require("./models/listing.js");
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in first");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req,res,next)=>{
     let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
        req.flash("error","Sorry but you are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();

}
module.exports.validateListing =(req,res,next)=>{
let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}