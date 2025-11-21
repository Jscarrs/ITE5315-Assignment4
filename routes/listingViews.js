const express = require("express");
const router = express.Router();
const Airbnb = require("../models/airbnb");

/**
 * GET /listings
 * Show all listings
 */
router.get("/", async (req, res) => {
  try {
    const listings = await Airbnb.find().lean();

    res.render("all-listings", {
      title: "All AirBnB Listings",
      listings,
      success: req.query.success || null,
    });
  } catch (err) {
    console.error("List Error:", err);
    res.render("error", { error: "Failed to load listings" });
  }
});

/**
 * GET /listings/search
 * Search listing by ID
 */
router.get("/search", async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.render("error", { error: "Please enter a listing ID" });
    }

    const listing = await Airbnb.findOne({ id }).lean();

    if (!listing) {
      return res.render("error", { error: "Listing not found" });
    }

    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Search Error:", err);
    res.render("error", { error: "Failed to perform search" });
  }
});

/**
 * GET /listings/add
 */
router.get("/add", (req, res) => {
  res.render("add-listing", { title: "Add New Listing" });
});

/**
 * POST /listings/add
 */
router.post("/add", async (req, res) => {
  try {
    const newListing = new Airbnb({
      id: Date.now().toString(),
      NAME: req.body.NAME,
      "host id": req.body.host_id || "0000000000",
      "host name": req.body.host_name || "Unknown Host",

      "neighbourhood group": req.body.neighbourhood_group,
      neighbourhood: req.body.neighbourhood,
      country: req.body.country || "United States",
      "room type": req.body.room_type,

      price: "$" + req.body.price,
      "service fee": "$20",

      "minimum nights": req.body.minimum_nights || "1",
      "number of reviews": "0",
      "reviews per month": "0",
      "review rate number": "0",
      "calculated host listings count": "1",
      "availability 365": "365",

      property_type: req.body.property_type,

      thumbnail:
        req.body.thumbnail ||
        `https://picsum.photos/seed/${Date.now()}/400/300`,

      images: [req.body.image1, req.body.image2, req.body.image3].filter(
        Boolean
      ),
    });

    await newListing.save();

    res.redirect("/listings?success=Listing added successfully");
  } catch (err) {
    console.error("Create Error:", err);
    res.render("add-listing", {
      title: "Add New Listing",
      error: "Could not create listing",
      formData: req.body,
    });
  }
});

/**
 * GET /listings/:id
 * View single listing
 */
router.get("/:id", async (req, res) => {
  try {
    const listing = await Airbnb.findOne({ id: req.params.id }).lean();

    if (!listing) {
      return res.render("error", { error: "Listing not found" });
    }

    res.render("listing-details", {
      title: listing.NAME,
      listing,
    });
  } catch (err) {
    console.error("Detail Error:", err);
    res.render("error", { error: "Failed to load listing" });
  }
});

/**
 * POST /listings/:id/delete
 */
router.post("/:id/delete", async (req, res) => {
  try {
    await Airbnb.findOneAndDelete({ id: req.params.id });
    res.redirect("/listings?success=Listing deleted");
  } catch (err) {
    console.error("Delete Error:", err);
    res.render("error", { error: "Failed to delete listing" });
  }
});

module.exports = router;
