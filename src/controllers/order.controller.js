const pool = require("../config/mysql");

const cartService = require("../services/cart.service");
const orderService = require("../services/order.service");

const activityService = require("../services/activity.service");
const notificationService = require("../services/notification.service");

const cacheService = require("../services/cache.service");

const OrderActivity = require("../models/OrderActivity");

// ======================================
// Get My Orders
// ======================================

exports.getMyOrders = async (req, res) => {

    try {

        const userId = req.user.id;

        const [orders] = await pool.query(

            `SELECT *
             FROM orders
             WHERE user_id = ?
             ORDER BY created_at DESC`,

            [userId]

        );

        return res.status(200).json({

            success: true,

            count: orders.length,

            orders

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
// Get Single Order
// ======================================

exports.getOrderById = async (req, res) => {

    try {

        const userId = req.user.id;

        const { orderId } = req.params;

        // ===========================
        // Get Order
        // ===========================

        const [orders] = await pool.query(

            `SELECT *
             FROM orders
             WHERE id = ?
             AND user_id = ?`,

            [orderId, userId]

        );

        if (orders.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        // ===========================
        // Get Order Items
        // ===========================

        const [items] = await pool.query(

            `SELECT

                oi.*,

                p.name,

                p.thumbnail

            FROM order_items oi

            INNER JOIN products p
                ON oi.product_id = p.id

            WHERE oi.order_id = ?`,

            [orderId]

        );

        return res.status(200).json({

            success: true,

            order: orders[0],

            items

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
// CHECKOUT (Place Order)
// ======================================

exports.checkout = async (req, res) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const userId = req.user.id;

        const {
            paymentMethod = "COD",
            shippingAddress
        } = req.body;

        // =========================
        // 1. Get Cart from Redis
        // =========================

        const cart = await cartService.getCart(userId);

        if (!cart || cart.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });

        }

        // =========================
        // 2. Build Order Items
        // =========================

        const ids = cart.map(i => i.productId);

        const [products] = await connection.query(

            `SELECT id, price, stock FROM products WHERE id IN (?)`,

            [ids]

        );

        let totalAmount = 0;

        const orderItems = [];

        for (let item of cart) {

            const product = products.find(p => p.id == item.productId);

            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${item.productId}`);
            }

            const subtotal = product.price * item.quantity;

            totalAmount += subtotal;

            orderItems.push({
                productId: item.productId,
                price: product.price,
                quantity: item.quantity,
                subtotal
            });
        }

        // =========================
        // 3. Create Order
        // =========================

        const orderId = await orderService.createOrder(
            connection,
            {
                userId,
                totalAmount,
                paymentMethod,
                shippingAddress
            }
        );

        // =========================
        // 4. Create Order Items
        // =========================

        await orderService.createOrderItems(
            connection,
            orderId,
            orderItems
        );

        // =========================
        // 5. Update Stock
        // =========================

        await orderService.updateStock(
            connection,
            orderItems
        );

        // =========================
        // 6. Clear Cart (Redis)
        // =========================

        await cartService.clearCart(userId);

        // =========================
        // 7. Commit Transaction
        // =========================

        await connection.commit();

        return res.status(200).json({

            success: true,
            message: "Order placed successfully",
            orderId,
            totalAmount

        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message || "Checkout failed"

        });

    } finally {

        connection.release();

    }
};


// ======================================
// Admin - Get All Orders
// ======================================

exports.getAllOrders = async (req, res) => {

    try {

        const [orders] = await pool.query(

            `SELECT

                o.id,
                o.total_amount,
                o.status,
                o.payment_status,
                o.payment_method,
                o.created_at,

                u.id AS user_id,
                u.name,
                u.email

            FROM orders o

            INNER JOIN users u
                ON o.user_id = u.id

            ORDER BY o.created_at DESC`

        );

        return res.status(200).json({

            success: true,

            count: orders.length,

            orders

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
// Admin - Update Order Status
// ======================================

exports.updateOrderStatus = async (req, res) => {

    try {

        const { orderId } = req.params;

        const { status } = req.body;

        const allowedStatus = [

            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"

        ];

        // Validate Status
        if (!allowedStatus.includes(status)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order status."

            });

        }

        // Check Order
        const [orders] = await pool.query(

            `SELECT * FROM orders WHERE id = ?`,

            [orderId]

        );

        if (orders.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        // Update Status
        await pool.query(

            `UPDATE orders
             SET status = ?
             WHERE id = ?`,

            [status, orderId]

        );

        // ======================================
// MongoDB Activity Log
// ======================================

await activityService.createActivity({
    userId: orders[0].user_id,
    orderId,
    action: "ORDER_STATUS_UPDATED",
    message: `Order status changed to ${status}`
});

// ======================================
// MongoDB Notification
// ======================================

await notificationService.createNotification({
    userId: orders[0].user_id,
    title: "Order Update",
    message: `Your order #${orderId} is now ${status}`
});

// ======================================
// Redis Cache Clear
// ======================================

await cacheService.deleteCache(`order:${orderId}`);

        return res.status(200).json({

            success: true,

            message: "Order status updated successfully."

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
// Track Order
// ======================================
// ======================================
// Track Order
// ======================================

exports.trackOrder = async (req, res) => {

    try {

        const userId = req.user.id;

        const { orderId } = req.params;

        const cacheKey = `order_tracking:${orderId}`;

        // ======================================
        // Check Redis Cache
        // ======================================

        const cachedOrder = await cacheService.getCache(cacheKey);

        if (cachedOrder) {

            return res.status(200).json({

                success: true,

                source: "Redis",

                ...cachedOrder

            });

        }

        // ======================================
        // Get Order
        // ======================================

        const [orders] = await pool.query(

            `SELECT *

             FROM orders

             WHERE id = ?

             AND user_id = ?`,

            [orderId, userId]

        );

        if (orders.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        // ======================================
        // Get Order Items
        // ======================================

        const [items] = await pool.query(

            `SELECT

                oi.*,

                p.name,

                p.thumbnail

            FROM order_items oi

            INNER JOIN products p
                ON oi.product_id = p.id

            WHERE oi.order_id = ?`,

            [orderId]

        );

        // ======================================
        // MongoDB Timeline
        // ======================================

        const timeline = await Activity.find({

            orderId: Number(orderId)

        })

        .sort({

            createdAt: 1

        });

        // ======================================
        // Response
        // ======================================

        const response = {

            success: true,

            order: orders[0],

            items,

            timeline

        };

        // ======================================
        // Save Cache
        // ======================================

        await cacheService.setCache(

            cacheKey,

            response,

            300

        );

        return res.status(200).json({

            source: "MySQL + MongoDB",

            ...response

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
// Cancel Order
// ======================================

exports.cancelOrder = async (req, res) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const userId = req.user.id;

        const { orderId } = req.params;

        // ===========================
        // Check Order
        // ===========================

        const [orders] = await connection.query(

            `SELECT *
             FROM orders
             WHERE id = ?
             AND user_id = ?`,

            [orderId, userId]

        );

        if (orders.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        const order = orders[0];

        // ===========================
        // Already Cancelled
        // ===========================

        if (order.status === "cancelled") {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Order is already cancelled."

            });

        }

        // ===========================
        // Delivered Orders
        // ===========================

        if (order.status === "delivered") {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Delivered orders cannot be cancelled."

            });

        }

        // ===========================
        // Get Order Items
        // ===========================

        const [items] = await connection.query(

            `SELECT
                product_id,
                quantity
             FROM order_items
             WHERE order_id = ?`,

            [orderId]

        );

        // ===========================
        // Restore Stock
        // ===========================

        await orderService.restoreStock(

            connection,

            items

        );

        // ===========================
        // Cancel Order
        // ===========================

        await orderService.cancelOrder(

            connection,

            orderId

        );

        // ===========================
        // MongoDB Activity
        // ===========================

        await activityService.createActivity({

            userId,

            orderId,

            action: "ORDER_CANCELLED",

            message: `Order #${orderId} cancelled successfully.`

        });

        // ===========================
        // MongoDB Notification
        // ===========================

        await notificationService.createNotification({

            userId,

            title: "Order Cancelled",

            message: `Your order #${orderId} has been cancelled successfully.`

        });

        // ===========================
        // Redis Cache
        // ===========================

        await cacheService.deleteCache(

            `order:${orderId}`

        );

        await cacheService.deleteCache(

            `order_tracking:${orderId}`

        );

        // ===========================
        // Commit
        // ===========================

        await connection.commit();

        return res.status(200).json({

            success: true,

            message: "Order cancelled successfully."

        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    } finally {

        connection.release();

    }

};