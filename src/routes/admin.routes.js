const express = require("express");

const router = express.Router();

const orderController = require("../controllers/order.controller");

const { authenticateUser } = require("../middleware/auth.middleware");

const { authorizeAdmin } = require("../middleware/admin.middleware");

// ======================================
// Admin Orders
// ======================================

router.get(
    "/orders",
    authenticateUser,
    authorizeAdmin,
    orderController.getAllOrders
);

// Update Order Status
router.put(
    "/orders/:orderId/status",
    authenticateUser,
    authorizeAdmin,
    orderController.updateOrderStatus
);

module.exports = router;