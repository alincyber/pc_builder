const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    userId: {
        type: Number,
        required: true
    },

    productId: {
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
    }

}, {
    timestamps: true
});

// Prevent duplicate reviews from the same user
reviewSchema.index(
    { userId: 1, productId: 1 },
    { unique: true }
);

module.exports =
    mongoose.models.Review ||
    mongoose.model("Review", reviewSchema);