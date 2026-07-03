const pool = require("../config/mysql");

// ======================================
// Create Order
// ======================================

exports.createOrder = async (connection, orderData) => {

    const {
        userId,
        totalAmount,
        status = "pending",
        paymentStatus = "pending",
        paymentMethod,
        shippingAddress
    } = orderData;

    const [result] = await connection.query(

        `INSERT INTO orders 
        (user_id, total_amount, status, payment_status, payment_method, shipping_address)
        VALUES (?, ?, ?, ?, ?, ?)`,

        [
            userId,
            totalAmount,
            status,
            paymentStatus,
            paymentMethod,
            shippingAddress
        ]

    );

    return result.insertId;
};

// ======================================
// Create Order Items
// ======================================

exports.createOrderItems = async (connection, orderId, items) => {

    for (let item of items) {

        await connection.query(

            `INSERT INTO order_items 
            (order_id, product_id, price, quantity, subtotal)
            VALUES (?, ?, ?, ?, ?)`,

            [
                orderId,
                item.productId,
                item.price,
                item.quantity,
                item.subtotal
            ]

        );
    }
};

// ======================================
// Update Product Stock
// ======================================

exports.updateStock = async (connection, items) => {

    for (let item of items) {

        await connection.query(

            `UPDATE products 
             SET stock = stock - ? 
             WHERE id = ? AND stock >= ?`,

            [
                item.quantity,
                item.productId,
                item.quantity
            ]

        );
    }
};

// ======================================
// Check Stock Before Order
// ======================================

exports.checkStock = async (connection, items) => {

    for (let item of items) {

        const [rows] = await connection.query(

            `SELECT stock FROM products WHERE id = ?`,

            [item.productId]

        );

        if (rows.length === 0) {
            return {
                success: false,
                message: `Product ${item.productId} not found`
            };
        }

        if (rows[0].stock < item.quantity) {
            return {
                success: false,
                message: `Insufficient stock for product ${item.productId}`
            };
        }
    }

    return { success: true };
};