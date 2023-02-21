const express = require("express");
//Preserve the req.params values from the parent router
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utilities/catchAsync");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviews = require("../controllers/reviews");


////////////////////////////////////////////////////////////////////////////////////


router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

//Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
