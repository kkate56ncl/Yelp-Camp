const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
}

module.exports.register = async(req, res) => {
  try{
    const {username, email, password} = req.body;
    const user = new User({username, email});
    //User.register() automatically save the user in the db. It's a method from passport-local-mongoose
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if(err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
    
  } catch(err) {
    req.flash("error", err.message);
    res.redirect("/register");  
//If u want to populate the error from the inner functions to the top level catch block, you need to re throw the error from the inner function catch block.   
  }  
}

module.exports.renderLogin =(req, res) => {
  res.render("users/login");
}

module.exports.login = (req, res) => {
  req.flash("success", "Welcom Back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";

  //delete operator removes a property from object
  delete req.session.returnTo;
  res.redirect(redirectUrl);
}

module.exports.logout =  (req, res, next) => {
  //req.logout() requires a callback function as an argument.
  //Within the callback, we can handle any potential errors and execute the flash message and redirect
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "See you later!");
    res.redirect("/campgrounds");
  });
}