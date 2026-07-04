const express = require("express");

const router = express.Router();

const reviewController =
require("../controllers/review.controller");

router.post("/",reviewController.addReview);

router.get("/",reviewController.getReviews);

router.get("/product/:productId",
reviewController.getProductReviews);

router.get("/:id",
reviewController.getReviewById);

router.put("/:id",
reviewController.updateReview);

router.delete("/:id",
reviewController.deleteReview);

router.patch("/:id/like",
reviewController.likeReview);

module.exports = router;