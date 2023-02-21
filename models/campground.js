const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

//https://res.cloudinary.com/detjaqmpg/image/upload/w_500/v1675674683/YelpCamp/cf4jyjiwfr7dv5w4vyk0.jpg

const opts = { toJSON: { virtuals: true } };

const ImagesSchema = new Schema({
  url: String,
  filename: String,
});

ImagesSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300");
});

const campgroundSchema = new Schema(
  {
    title: String,
    images: [ImagesSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

campgroundSchema.virtual("properties.popupMarkup").get(function () {
  return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
});

campgroundSchema.post("findOneAndDelete", async function (deletedDoc) {
  if (deletedDoc) {
    await Review.deleteMany({
      _id: {
        $in: deletedDoc.reviews,
      },
    });
  }
  // if(deletedDoc.images) {
  //   for (let img of deletedDoc.images) {
  //     await cloudinary.uploader.destroy(img.filename);
  //   }
  // }
});

module.exports = mongoose.model("Campground", campgroundSchema);
