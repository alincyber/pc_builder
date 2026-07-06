const pool = require("../config/mysql");
const reviewService = require("../services/review.service");

// ======================================
// Add Review
// ======================================

exports.addReview = async (req, res) => {

    try {

        const userId = req.user.id;

        const {

            productId,
            rating,
            review

        } = req.body;

        if (!productId || !rating || !review) {

            return res.status(400).json({

                success: false,
                message: "All fields are required."

            });

        }

        if (rating < 1 || rating > 5) {

            return res.status(400).json({

                success: false,
                message: "Rating must be between 1 and 5."

            });

        }

        // Check Product

        const [products] = await pool.query(

            `SELECT id
             FROM products
             WHERE id = ?`,

            [productId]

        );

        if (products.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Product not found."

            });

        }

        const newReview = await reviewService.addReview({

            userId,
            productId,
            rating,
            review

        });

        return res.status(201).json({

            success: true,
            message: "Review added successfully.",
            review: newReview

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================
// Get Product Reviews
// ======================================

exports.getProductReviews = async (req, res) => {

    try {

        const { productId } = req.params;

        const reviews = await reviewService.getProductReviews(productId);

        return res.status(200).json({

            success: true,
            count: reviews.length,
            reviews

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Get My Reviews
// ======================================

exports.getMyReviews = async (req, res) => {

    try {

        const userId = req.user.id;

        const reviews = await reviewService.getUserReviews(userId);

        return res.status(200).json({

            success: true,
            count: reviews.length,
            reviews

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Update Review
// ======================================

exports.updateReview = async (req, res) => {

    try {

        const userId = req.user.id;

        const { reviewId } = req.params;

        const {

            rating,
            review

        } = req.body;

        const updated = await reviewService.updateReview(

            reviewId,
            userId,
            {

                rating,
                review

            }

        );

        if (!updated) {

            return res.status(404).json({

                success: false,
                message: "Review not found."

            });

        }

        return res.status(200).json({

            success: true,
            message: "Review updated successfully.",
            review: updated

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Delete Review
// ======================================

exports.deleteReview = async (req, res) => {

    try {

        const userId = req.user.id;

        const { reviewId } = req.params;

        const deleted = await reviewService.deleteReview(

            reviewId,
            userId

        );

        if (!deleted) {

            return res.status(404).json({

                success: false,
                message: "Review not found."

            });

        }

        return res.status(200).json({

            success: true,
            message: "Review deleted successfully."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Review Summary
// ======================================

exports.getReviewSummary = async (req, res) => {

    try {

        const { productId } = req.params;

        const summary = await reviewService.getReviewSummary(productId);

        return res.status(200).json({

            success: true,
            summary

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};