const express = require("express");
const campgrounds = require("../controllers/campgrounds");
const Campground = require("../models/campground");
const catchAsync = require("../utilities/catchAsync");
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

//Multer is a node.js middlewares handling multipart/form-data, which is primarily used for uploading files
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

////////////////////////////////////////////////////////////////////////////////////
//router.route() return an instance of a single route which you can use to handle HTTP verbs with optional middleware.
router
  .route("/")
  //Show all campgrounds
  .get(catchAsync(campgrounds.index))
  //Create: get new campground form data
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

//Create: render the form to add new campground
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  //Show selected campground mathing the id
  .get(catchAsync(campgrounds.showCampground))
  //Update: update campground information
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  //Delete:
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//Update: render the form to update campground information
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
