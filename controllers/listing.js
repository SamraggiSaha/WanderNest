const Listing = require('../models/listing.js');
module.exports.index = async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
};