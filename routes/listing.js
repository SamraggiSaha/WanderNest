const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const {isLoggedin , isOwner} = require('../middleware.js');
const {validateListing} = require('../middleware.js');
const ListingController = require('../controllers/listing.js');
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });
//Index route & create route together
router.route("/")
  .get(wrapAsync(ListingController.index))
  .post(isLoggedin,upload.single('listing[image]'),validateListing, wrapAsync(ListingController.createListing));


//New route
router.get("/new", isLoggedin, ListingController.RenderNewForm);

//show route, update route and delete route together
router.route("/:id")
  .get(wrapAsync(ListingController.showListing))
  .put(upload.single('listing[image]'),validateListing, isLoggedin, isOwner, wrapAsync(ListingController.updateListing))
  .delete(isLoggedin, isOwner, wrapAsync(ListingController.destroyListing));


//Edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(ListingController.Editlisting));



module.exports = router;