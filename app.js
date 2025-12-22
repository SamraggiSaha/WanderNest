const express=require('express');
const app=express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride=require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');
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
 //app.get("/testlisting",async(req,res)=>{
    //  let sampleListing = new Listing({
          //  title:"My Villa",
                 //description:"A beautiful villa by the sea",
        //price:1200,
        //location:"Calangute,Goa",
       // country:"India",
    //  });
    // await sampleListing.save();
     //console.log("Sample listing saved");
     //res.send("successful testing");
 //});
app.get("/listings", wrapAsync(async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}));
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs",{listing:{}});
});
app.post("/listings",wrapAsync(async(req,res,next)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));
//Edit route
app.get("/listing/:id/edit", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
app.put("/listings/:id", wrapAsync(async(req,res)=>{
    if(! req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
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