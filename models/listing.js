const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    property_type: String,
    room_type: String,
    bedrooms: Number,
    bathrooms: Number,
    amenities: [String],
    address: {
        street: String,
        suburb: String,
        government_area: String,
        market: String,
        country: String,
        country_code: String
    },
    images: {
        picture_url: String
    }
}, { 
    collection: 'listings',
    timestamps: true 
});

module.exports = mongoose.model('Listing', listingSchema);