const express=require('express');
const app=express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride=require('method-override');
const ejsMate = require("ejs-mate")
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
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.listen(8080,(req,res)=>{
console.log("server is running on port 8080");
});
app.get("/",(req,res)=>{
    res.send("working");
});
 // app.get("/testlisting",async(req,res)=>{
    //  let sampleListing = new Listing({
        //  title:"My Villa",
                     //description:"A beautiful villa by the sea",
        //price:1200,
        //location:"Calangute,Goa",
       // country:"India",
  //  });
    //await sampleListing.save();
    //console.log("Sample listing saved");
    //res.send("successful testing");
//});
app.get("/listings", async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
});
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs",{listing:{}});
});
app.post("/listings",async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
app.get("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
//Edit route
app.get("/listing/:id/edit", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
app.put("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});
