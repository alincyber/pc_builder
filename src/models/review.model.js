const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    productId: {
        type: Number,
        required: true
    },

    userId: {
        type: Number,
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    review: {
        type: String,
        required: true,
        trim: true
    },

    verifiedPurchase: {
        type: Boolean,
        default: false
    },

    likes: {
        type: Number,
        default: 0
    },

    images: [{
        type: String
    }]

}, {

    timestamps: true

});

module.exports = mongoose.model("Review", reviewSchema);