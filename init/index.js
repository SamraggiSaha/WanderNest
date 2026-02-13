const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
main().then(()=>{
    console.log("connected to db succesfully");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};
const initDb= async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj,owner:"697a39b35f7b718a8caf6bab"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised with sample data");
};
initDb();