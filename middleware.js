const ExpressError = require("./utilities/ExpressError");
const { campgroundSchema, reviewSchmea } = require("./schemas");
const Campground = require("./models/campground");
const Review= require("./models/review");

//Authentication
module.exports.isLoggedIn = (req, res, next) => {
  //req.isAuthenticated() checks if the user is alreay authenticated by the authentication function
  if(!req.isAuthenticated()) {  
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
}

//Express middleware for validation campground and review using JOI
module.exports.validateCampground = (req, res, next) => {
  //campgroundSchema here is not a mongoose schema, it is going to validate req.body before saving it with mongoose.
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    //error.details is an array of objects. el.message is a property of inside object.
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Authorization
module.exports.isAuthor = async (req, res, next) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
}

//Express middleware for validation campground and review using JOI
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchmea.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}