const pool = require("../config/mysql");
const wishlistService = require("../services/wishlist.service");
const cartService = require("../services/cart.service");
// ======================================
// Add Product To Wishlist
// ======================================

exports.addToWishlist = async (req, res) => {

    try {

        const userId = req.user.id;

        const { productId } = req.body;

        if (!productId) {

            return res.status(400).json({

                success: false,

                message: "Product ID is required."

            });

        }

        // Check Product Exists
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

        const wishlist = await wishlistService.addToWishlist(

            userId,

            productId

        );

        return res.status(200).json({

            success: true,

            message: "Product added to wishlist.",

            wishlist

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
// Get Wishlist
// ======================================

exports.getWishlist = async (req, res) => {

    try {

        const userId = req.user.id;

        const wishlist = await wishlistService.getWishlist(userId);

        if (!wishlist || wishlist.products.length === 0) {

            return res.status(200).json({

                success: true,

                count: 0,

                wishlist: []

            });

        }

        const ids = wishlist.products.map(

            item => item.productId

        );

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

        return res.status(200).json({

            success: true,

            count: products.length,

            wishlist: products

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
// Remove Product
// ======================================

exports.removeFromWishlist = async (req, res) => {

    try {

        const userId = req.user.id;

        const { productId } = req.params;

        const wishlist = await wishlistService.removeFromWishlist(

            userId,

            productId

        );

        return res.status(200).json({

            success: true,

            message: "Product removed from wishlist.",

            wishlist

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
// Wishlist Count
// ======================================

exports.getWishlistCount = async (req, res) => {

    try {

        const userId = req.user.id;

        const count = await wishlistService.getWishlistCount(

            userId

        );

        return res.status(200).json({

            success: true,

            count

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
// Clear Wishlist
// ======================================

exports.clearWishlist = async (req, res) => {

    try {

        const userId = req.user.id;

        await wishlistService.clearWishlist(userId);

        return res.status(200).json({

            success: true,

            message: "Wishlist cleared successfully."

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
// Move Wishlist Product To Cart
// ======================================

exports.moveToCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const { productId } = req.params;

        // Check Product

        const [products] = await pool.query(

            `SELECT
                id,
                stock
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

        if (products[0].stock <= 0) {

            return res.status(400).json({

                success: false,

                message: "Product is out of stock."

            });

        }

        // Add To Redis Cart

        await cartService.addToCart(

            userId,

            productId,

            1

        );

        // Remove From Wishlist

        await wishlistService.removeFromWishlist(

            userId,

            productId

        );

        return res.status(200).json({

            success: true,

            message: "Product moved to cart successfully."

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};