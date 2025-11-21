/*******************************
 * ITE5315 – Assignment 4
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Scarlett Jet Student ID: N01675129 Date: November 20, 2025
 *
 ********************************/

const mongoose = require("mongoose");
const AirbnbListing = require("../models/airbnb");

// GET ALL
exports.getAll = async (req, res, next) => {
  try {
    const listings = await AirbnbListing.find().lean();
    res.json(listings);
  } catch (err) {
    next(err);
  }
};

// GET ONE (by _id or by JSON id)
exports.getOne = async (req, res, next) => {
  try {
    let listing = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      listing = await AirbnbListing.findById(req.params.id).lean();
    }
    if (!listing) {
      listing = await AirbnbListing.findOne({ id: req.params.id }).lean();
    }

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    res.json(listing);
  } catch (err) {
    next(err);
  }
};

// CREATE
exports.create = async (req, res, next) => {
  try {
    const listing = await AirbnbListing.create(req.body);
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.update = async (req, res, next) => {
  try {
    let listing = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      listing = await AirbnbListing.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: false,
      });
    }
    if (!listing) {
      listing = await AirbnbListing.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: false }
      );
    }

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    res.json(listing);
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.remove = async (req, res, next) => {
  try {
    let listing = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      listing = await AirbnbListing.findByIdAndDelete(req.params.id);
    }
    if (!listing) {
      listing = await AirbnbListing.findOneAndDelete({ id: req.params.id });
    }

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
