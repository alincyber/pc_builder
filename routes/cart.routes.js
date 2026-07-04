const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart.controller");

const { authenticateUser } = require("../middleware/auth.middleware");

// Add Product
router.post(
    "/",
    authenticateUser,
    cartController.addToCart
);

// Get Cart
router.get(
    "/",
    authenticateUser,
    cartController.getCart
);

// Update Quantity
router.put(
    "/:productId",
    authenticateUser,
    cartController.updateQuantity
);

// Remove Product
router.delete(
    "/:productId",
    authenticateUser,
    cartController.removeFromCart
);

// Clear Cart
router.delete(
    "/",
    authenticateUser,
    cartController.clearCart
);

module.exports = router;