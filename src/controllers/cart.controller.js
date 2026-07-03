const pool = require("../config/mysql");
const cartService = require("../services/cart.service");

// ======================================
// Add Product To Cart
// ======================================

exports.addToCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const {

            productId,
            quantity

        } = req.body;

        // ==========================
        // Validation
        // ==========================

        if (!productId || !quantity) {

            return res.status(400).json({

                success: false,

                message: "Product ID and Quantity are required."

            });

        }

        if (quantity <= 0) {

            return res.status(400).json({

                success: false,

                message: "Quantity must be greater than zero."

            });

        }

        // ==========================
        // Check Product
        // ==========================

        const [products] = await pool.query(

            `SELECT

                id,
                name,
                price,
                stock,
                thumbnail

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

        const product = products[0];

        if (product.stock < quantity) {

            return res.status(400).json({

                success: false,

                message: "Insufficient stock."

            });

        }

        // ==========================
        // Save To Redis
        // ==========================

        const cart = await cartService.addToCart(

            userId,

            productId,

            quantity

        );

        return res.status(200).json({

            success: true,

            message: "Product added to cart.",

            cart

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
// Get Cart
// ======================================

exports.getCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const cart = await cartService.getCart(userId);

        if (cart.length === 0) {

            return res.status(200).json({

                success: true,

                count: 0,

                cart: []

            });

        }

        const ids = cart.map(item => item.productId);

        const placeholders = ids.map(() => "?").join(",");

        const [products] = await pool.query(

            `SELECT

                id,
                name,
                price,
                stock,
                thumbnail

            FROM products

            WHERE id IN (${placeholders})`,

            ids

        );

        const cartItems = cart.map(item => {

            const product = products.find(

                p => p.id == item.productId

            );

            return {

                ...product,

                quantity: item.quantity,

                subtotal: product.price * item.quantity

            };

        });

        const total = cartItems.reduce(

            (sum, item) => sum + item.subtotal,

            0

        );

        return res.status(200).json({

            success: true,

            count: cartItems.length,

            total,

            cart: cartItems

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
// Update Cart Quantity
// ======================================

exports.updateQuantity = async (req, res) => {

    try {

        const userId = req.user.id;

        const { productId } = req.params;

        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {

            return res.status(400).json({

                success: false,

                message: "Quantity must be greater than zero."

            });

        }

        const [products] = await pool.query(

            `SELECT stock
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

        if (products[0].stock < quantity) {

            return res.status(400).json({

                success: false,

                message: "Insufficient stock."

            });

        }

        const cart = await cartService.updateQuantity(

            userId,

            productId,

            quantity

        );

        if (!cart) {

            return res.status(404).json({

                success: false,

                message: "Product not found in cart."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Cart updated successfully.",

            cart

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
// Clear Cart
// ======================================

exports.clearCart = async (req, res) => {

    try {

        const userId = req.user.id;

        await cartService.clearCart(userId);

        return res.status(200).json({

            success: true,

            message: "Cart cleared successfully."

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
// Remove Product From Cart
// ======================================

exports.removeFromCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const { productId } = req.params;

        const cart = await cartService.removeFromCart(

            userId,

            productId

        );

        return res.status(200).json({

            success: true,

            message: "Product removed successfully.",

            cart

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};