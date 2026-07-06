const Review = require("../models/review.model");

// ======================================
// Add Review
// ======================================

exports.addReview = async (data) => {

    return await Review.create(data);

};

// ======================================
// Get Product Reviews
// ======================================

exports.getProductReviews = async (productId) => {

    return await Review.find({

        productId

    }).sort({

        createdAt: -1

    });

};

// ======================================
// Get User Reviews
// ======================================

exports.getUserReviews = async (userId) => {

    return await Review.find({

        userId

    }).sort({

        createdAt: -1

    });

};

// ======================================
// Update Review
// ======================================

exports.updateReview = async (

    reviewId,

    userId,

    data

) => {

    return await Review.findOneAndUpdate(

        {

            _id: reviewId,

            userId

        },

        data,

        {

            new: true

        }

    );

};

// ======================================
// Delete Review
// ======================================

exports.deleteReview = async (

    reviewId,

    userId

) => {

    return await Review.findOneAndDelete({

        _id: reviewId,

        userId

    });

};

// ======================================
// Review Summary
// ======================================

exports.getReviewSummary = async (productId) => {

    const result = await Review.aggregate([

        {

            $match: {

                productId: Number(productId)

            }

        },

        {

            $group: {

                _id: "$productId",

                averageRating: {

                    $avg: "$rating"

                },

                totalReviews: {

                    $sum: 1

                }

            }

        }

    ]);

    if (result.length === 0) {

        return {

            averageRating: 0,

            totalReviews: 0

        };

    }

    return {

        averageRating:

            Number(result[0].averageRating.toFixed(1)),

        totalReviews:

            result[0].totalReviews

    };

};