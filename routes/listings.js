// routes/listings.js
// This version does NOT use MongoDB. It reads and writes to airbnb_data.json.

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "airbnb_data.json");

// Load JSON data from file
function loadData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

// Save JSON data back to file
function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/* ==========================================================
   GET: Show all listings
   Renders all-listings.hbs
   ========================================================== */
router.get("/", (req, res) => {
  const listings = loadData();
  res.render("all-listings", { title: "All AirBnB Listings", listings });
});

/* ==========================================================
   GET: Show Add Listing Form
   Renders add-listing.hbs
   ========================================================== */
router.get("/add", (req, res) => {
  res.render("add-listing", { title: "Add New Listing" });
});

/* ==========================================================
   POST: Create a new listing
   Saves new listing into airbnb_data.json
   ========================================================== */
router.post("/add", (req, res) => {
  const data = loadData();

  // Construct new listing object matching dataset structure
  const newListing = {
    id: req.body.id,
    NAME: req.body.name,
    host_id: req.body.host_id || "",
    host_name: req.body.host_name || "",
    neighbourhood_group: req.body.neighbourhood_group,
    neighbourhood: req.body.neighbourhood,
    price: `$${req.body.price} `,
    property_type: req.body.property_type,
    room_type: req.body.room_type,
    minimum_nights: req.body.minimum_nights,
    country: req.body.country,

    // Images (dataset uses picsum)
    thumbnail:
      req.body.thumbnail || `https://picsum.photos/seed/${req.body.id}/400/300`,
    images: [
      `https://picsum.photos/seed/${req.body.id}a/600/400`,
      `https://picsum.photos/seed/${req.body.id}b/600/400`,
      `https://picsum.photos/seed/${req.body.id}c/600/400`,
    ],

    // Auto-generated dataset fields
    number_of_reviews: 0,
    reviews_per_month: 0,
    review_rate_number: 0,
    rating: null,
  };

  // Add to dataset
  data.push(newListing);
  saveData(data);

  res.redirect("/listings");
});

/* ==========================================================
   GET: Show single listing details
   Uses listing-details.hbs
   ========================================================== */
router.get("/:id", (req, res) => {
  const data = loadData();
  const listing = data.find((l) => l.id === req.params.id);

  if (!listing) {
    return res.render("error", { message: "Listing not found" });
  }

  listing.imageUrl = listing.thumbnail;

  res.render("listing-details", {
    title: listing.NAME,
    listing,
  });
});

/* ==========================================================
   DELETE: Remove listing
   Simple GET route that deletes and redirects
   ========================================================== */
router.get("/:id/delete", (req, res) => {
  let data = loadData();
  data = data.filter((l) => l.id !== req.params.id);

  saveData(data);
  res.redirect("/listings");
});

module.exports = router;
