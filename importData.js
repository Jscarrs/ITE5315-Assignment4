/*******************************
 * ITE5315 – Assignment 4
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Scarlett Jet Student ID: N01675129 Date: November 20, 2025
 *
 ********************************/

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const Airbnb = require("./models/airbnb");
const config = require("./config/database");

// Connect to MongoDB
mongoose
  .connect(config.url)
  .then(() => console.log("MongoDB connected for data import"))
  .catch((err) => console.error("Connection error:", err));

async function importData() {
  try {
    // Read the JSON file
    const rawData = fs.readFileSync("./airbnb_data.json");
    const listings = JSON.parse(rawData);

    console.log(`Found ${listings.length} listings to import`);

    // Clean the data and transform fields to match your exact JSON structure
    const cleanedListings = listings.map((listing) => {
      // Clean price - remove $ and spaces, convert to numbers
      const cleanPrice = listing.price
        ? parseInt(
            listing.price
              .replace("$", "")
              .replace(",", "")
              .replace(" ", "")
              .trim()
          ) || 0
        : 0;

      // Clean service fee - remove $ and spaces, convert to numbers
      const cleanServiceFee = listing["service fee"]
        ? parseInt(
            listing["service fee"]
              .replace("$", "")
              .replace(",", "")
              .replace(" ", "")
              .trim()
          ) || 0
        : 0;

      // Handle numeric fields
      const cleanMinimumNights = listing["minimum nights"]
        ? parseInt(listing["minimum nights"]) || 0
        : 0;

      const cleanNumberOfReviews = listing["number of reviews"]
        ? parseInt(listing["number of reviews"]) || 0
        : 0;

      const cleanReviewRateNumber = listing["review rate number"]
        ? parseInt(listing["review rate number"]) || 0
        : 0;

      const cleanCalculatedHostListingsCount = listing[
        "calculated host listings count"
      ]
        ? parseInt(listing["calculated host listings count"]) || 0
        : 0;

      const cleanAvailability365 = listing["availability 365"]
        ? parseInt(listing["availability 365"]) || 0
        : 0;

      // Handle coordinate fields - some might be empty strings
      const cleanLat =
        listing.lat && listing.lat.trim() !== ""
          ? parseFloat(listing.lat) || 0
          : 0;

      const cleanLong =
        listing.long && listing.long.trim() !== ""
          ? parseFloat(listing.long) || 0
          : 0;

      // Handle construction year
      const cleanConstructionYear = listing["Construction year"]
        ? parseInt(listing["Construction year"]) || null
        : null;

      return {
        // Keep ALL original fields exactly as they are in JSON
        id: listing.id,
        NAME: listing.NAME || "",
        "host id": listing["host id"] || "",
        host_identity_verified: listing.host_identity_verified || "",
        "host name": listing["host name"] || "",
        "neighbourhood group": listing["neighbourhood group"] || "",
        neighbourhood: listing.neighbourhood || "",
        lat: cleanLat,
        long: cleanLong,
        country: listing.country || "",
        "country code": listing["country code"] || "",
        instant_bookable: listing.instant_bookable || "",
        cancellation_policy: listing.cancellation_policy || "",
        "room type": listing["room type"] || "",
        "Construction year": cleanConstructionYear,
        price: cleanPrice, // Store as number for filtering
        "service fee": cleanServiceFee, // Store as number
        "minimum nights": cleanMinimumNights,
        "number of reviews": cleanNumberOfReviews,
        "last review": listing["last review"] || "",
        "reviews per month": listing["reviews per month"] || "",
        "review rate number": cleanReviewRateNumber,
        "calculated host listings count": cleanCalculatedHostListingsCount,
        "availability 365": cleanAvailability365,
        house_rules: listing.house_rules || "",
        license: listing.license || "",
        property_type: listing.property_type || "",
        thumbnail: listing.thumbnail || "",
        images: listing.images || [],
      };
    });

    // Clear existing data
    await Airbnb.deleteMany({});
    console.log("Cleared existing data");

    // Insert new data with error handling for individual documents
    let successfulImports = 0;
    let failedImports = 0;

    for (const listing of cleanedListings) {
      try {
        await Airbnb.create(listing);
        successfulImports++;
      } catch (error) {
        console.error(`Failed to import listing ${listing.id}:`, error.message);
        failedImports++;
      }
    }

    console.log(`Import completed:`);
    console.log(`- Successfully imported: ${successfulImports} listings`);
    console.log(`- Failed to import: ${failedImports} listings`);

    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
}

importData();
