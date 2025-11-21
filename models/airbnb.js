const mongoose = require("mongoose");

const airbnbSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },

    NAME: String,
    "host id": String,
    "host name": String,

    "neighbourhood group": String,
    neighbourhood: String,

    country: String,

    "room type": String,

    price: String,
    "service fee": String,
    "minimum nights": String,

    "number of reviews": String,
    "reviews per month": String,
    "review rate number": String,
    "calculated host listings count": String,
    "availability 365": String,

    property_type: String,

    thumbnail: String,
    images: [String],
  },
  { collection: "listings" }
);

module.exports = mongoose.model("AirbnbListing", airbnbSchema);
