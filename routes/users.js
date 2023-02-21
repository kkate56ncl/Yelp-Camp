const express = require("express");
const router = express.Router();
const users = require("../controllers/users")
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const {isLoggedIn} = require("../middleware");

router.route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

/*
passport.authenticate() extracts user credentials from request object and pass them to the authentication 
function. When authentication succeeds, req.user property is set to the authenticated user, a session is
established and the next function in the stack is called.
*/
router.route("/login")
  .get(users.renderLogin)
  .post(passport.authenticate("local", {failureFlash:true, failureRedirect:"/login", keepSessionInfo:true}),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;