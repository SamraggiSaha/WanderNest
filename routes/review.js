const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Review= require('../models/review.js');
const Listing = require('../models/listing.js');
const {validateReview,isLoggedin,isReviewAuthor} = require('../middleware.js');
const ReviewController = require('../controllers/review.js');

//post review route
router.post("/",isLoggedin,validateReview,wrapAsync(ReviewController.createReview));

//delete review route 
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(ReviewController.deleteReview));

module.exports = router;