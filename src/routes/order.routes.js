const express = require("express");

const router = express.Router();

const orderController = require("../controllers/order.controller");

const { authenticateUser } = require("../middleware/auth.middleware");

// ======================================
// Order Routes
// ======================================
// Get My Orders
router.get(
    "/",
    authenticateUser,
    orderController.getMyOrders
);
// Checkout
router.post(
    "/checkout",
    authenticateUser,
    orderController.checkout
);
// Get Single Order
router.get(
    "/:orderId",
    authenticateUser,
    orderController.getOrderById
);
router.get(
    "/:orderId/track",
    authenticateUser,
    orderController.trackOrder
);
// ======================================
// Cancel Order
// ======================================

router.put(
    "/:orderId/cancel",
    authenticateUser,
    orderController.cancelOrder
);
module.exports = router;