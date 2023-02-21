const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelps");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

main().catch((err) => {
  console.log("Connection Error");
  console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
  console.log("YelpCamp Database Connected!");
}
//https://api.unsplash.com/photos/random?client_id=7Lz2WcKlAW__i4ByrucOV7PyWpZ0IsC_Str7C2et2hc
//UNSPLASH API: (not working yet!!!)
// const clientId = "7Lz2WcKlAW__i4ByrucOV7PyWpZ0IsC_Str7C2et2hc";

// const seedImg = async () => {
//   try {
//     const res = await axios.get("https://api.unsplash.com/photos/random/", {
//       params: {
//         client_id: clientId,
//         collection: 1114848,
//       },
//     });
//     return res.data.urls.small;
//   } catch (err) {
//     console.log(err);
//   }
// };

const sampleSelect = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});

  for (let i = 0; i < 100; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "63eddedc7338ffa7bbeb69f7",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sampleSelect(descriptors)} ${sampleSelect(places)}`,
      // image:"https://source.unsplash.com/random/?Camping/",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. In eius aperiam minima, corrupti maxime fugiat nostrum ea alias ipsum esse similique explicabo est totam dolor consectetur? Fuga dolorum unde commodi.",
      price,
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].longitude, cities[random1000].latitude],
      },
      images: [
        {
          url: "https://res.cloudinary.com/detjaqmpg/image/upload/v1675674677/YelpCamp/fkxbehdptsnnldndx3gw.jpg",
          filename: "YelpCamp/fkxbehdptsnnldndx3gw",
        },
        {
          url: "https://res.cloudinary.com/detjaqmpg/image/upload/v1675674683/YelpCamp/cf4jyjiwfr7dv5w4vyk0.jpg",
          filename: "YelpCamp/cf4jyjiwfr7dv5w4vyk0",
        },
      ],
    });
    await camp.save();
  }
};

seedDB();

// seedDB().then(() => {
//   mongoose.connection.close();
// });
