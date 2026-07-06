const express = require("express");

const router = express.Router();

const reviewController = require("../controllers/review.controller");

const { authenticateUser } = require("../middleware/auth.middleware");

// Add Review
router.post(
    "/",
    authenticateUser,
    reviewController.addReview
);

// Get My Reviews
router.get(
    "/my",
    authenticateUser,
    reviewController.getMyReviews
);

// Get Product Reviews
router.get(
    "/product/:productId",
    reviewController.getProductReviews
);

// Get Review Summary
router.get(
    "/product/:productId/summary",
    reviewController.getReviewSummary
);

// Update Review
router.put(
    "/:reviewId",
    authenticateUser,
    reviewController.updateReview
);

// Delete Review
router.delete(
    "/:reviewId",
    authenticateUser,
    reviewController.deleteReview
);

module.exports = router;