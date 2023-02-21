const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//passport-local-mongoose handled the username and password field automatically behind the scenes
const UserSchema = new Schema({
  email: {
    type:String,
    required:true,
    unique:true,
  }
});

UserSchema.plugin(passportLocalMongoose);

//Handling the unique email error
UserSchema.post("save", function(err, doc, next) {
  if(err.name === "MongoServerError" && err.code === 11000)  {
    next(new Error('Email address was already taken, please choose a different one.'));
  } else {
    next();
  }
})




module.exports = mongoose.model("User", UserSchema);