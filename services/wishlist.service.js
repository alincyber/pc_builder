const Wishlist = require("../models/wishlist.model");

// ======================================
// Add Product To Wishlist
// ======================================

exports.addToWishlist = async (userId, productId) => {

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {

        wishlist = await Wishlist.create({

            userId,

            products: [

                {

                    productId

                }

            ]

        });

        return wishlist;

    }

    const exists = wishlist.products.find(

        item => item.productId == productId

    );

    if (exists) {

        return wishlist;

    }

    wishlist.products.push({

        productId

    });

    await wishlist.save();

    return wishlist;

};

// ======================================
// Get Wishlist
// ======================================

exports.getWishlist = async (userId) => {

    return await Wishlist.findOne({ userId });

};

// ======================================
// Remove Product
// ======================================

exports.removeFromWishlist = async (

    userId,

    productId

) => {

    const wishlist = await Wishlist.findOne({

        userId

    });

    if (!wishlist) {

        return null;

    }

    wishlist.products = wishlist.products.filter(

        item => item.productId != productId

    );

    await wishlist.save();

    return wishlist;

};

// ======================================
// Wishlist Count
// ======================================

exports.getWishlistCount = async (userId) => {

    const wishlist = await Wishlist.findOne({

        userId

    });

    if (!wishlist) {

        return 0;

    }

    return wishlist.products.length;

};

// ======================================
// Check Product Exists
// ======================================

exports.productExists = async (

    userId,

    productId

) => {

    const wishlist = await Wishlist.findOne({

        userId

    });

    if (!wishlist) {

        return false;

    }

    return wishlist.products.some(

        item => item.productId == productId

    );

};

// ======================================
// Clear Wishlist
// ======================================

exports.clearWishlist = async (userId) => {

    await Wishlist.findOneAndUpdate(

        {

            userId

        },

        {

            $set: {

                products: []

            }

        }

    );

};