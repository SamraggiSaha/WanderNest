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
router.get("/new",isLoggedin,ListingController.RenderNewForm);

//create route
router.post("/",validateListing,isLoggedin,wrapAsync(ListingController.createListing));

//show route
router.get("/:id",wrapAsync(ListingController.showListing));

//Edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(ListingController.Editlisting));

//update route
router.put("/:id",validateListing,isLoggedin,isOwner,wrapAsync(ListingController.updateListing));

//delete route
router.delete("/:id",isLoggedin,isOwner,wrapAsync(ListingController.destroyListing));

module.exports = router;