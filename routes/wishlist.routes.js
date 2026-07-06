const express = require("express");

const router = express.Router();

const wishlistController = require("../controllers/wishlist.controller");

const { authenticateUser } = require("../middleware/auth.middleware");

// ======================================
// Add Product
// ======================================

router.post(
    "/",
    authenticateUser,
    wishlistController.addToWishlist
);

// ======================================
// Get Wishlist
// ======================================

router.get(
    "/",
    authenticateUser,
    wishlistController.getWishlist
);

// ======================================
// Wishlist Count
// ======================================

router.get(
    "/count",
    authenticateUser,
    wishlistController.getWishlistCount
);

// ======================================
// Remove Product
// ======================================

router.delete(
    "/:productId",
    authenticateUser,
    wishlistController.removeFromWishlist
);

// ======================================
// Clear Wishlist
// ======================================

router.delete(
    "/",
    authenticateUser,
    wishlistController.clearWishlist
);

router.post(
    "/move-to-cart/:productId",
    authenticateUser,
    wishlistController.moveToCart
);

module.exports = router;