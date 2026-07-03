const { redisClient } = require("../config/redis");

// ======================================
// Cart Key
// ======================================

const getCartKey = (userId) => {

    return `cart:${userId}`;

};

// ======================================
// Get Cart
// ======================================

exports.getCart = async (userId) => {

    const key = getCartKey(userId);

    const cart = await redisClient.get(key);

    return cart ? JSON.parse(cart) : [];

};

// ======================================
// Save Cart
// ======================================

exports.saveCart = async (userId, cart) => {

    const key = getCartKey(userId);

    await redisClient.set(

        key,

        JSON.stringify(cart)

    );

};

// ======================================
// Add Product To Cart
// ======================================

exports.addToCart = async (

    userId,

    productId,

    quantity

) => {

    const cart = await exports.getCart(userId);

    const existingProduct = cart.find(

        item => item.productId == productId

    );

    if (existingProduct) {

        existingProduct.quantity += quantity;

    } else {

        cart.push({

            productId,

            quantity

        });

    }

    await exports.saveCart(

        userId,

        cart

    );

    return cart;

};

// ======================================
// Update Quantity
// ======================================

exports.updateQuantity = async (

    userId,

    productId,

    quantity

) => {

    const cart = await exports.getCart(userId);

    const item = cart.find(

        item => item.productId == productId

    );

    if (!item) {

        return null;

    }

    item.quantity = quantity;

    await exports.saveCart(

        userId,

        cart

    );

    return cart;

};

// ======================================
// Remove Product
// ======================================

exports.removeFromCart = async (

    userId,

    productId

) => {

    const cart = await exports.getCart(userId);

    const updatedCart = cart.filter(

        item => item.productId != productId

    );

    await exports.saveCart(

        userId,

        updatedCart

    );

    return updatedCart;

};

// ======================================
// Clear Cart
// ======================================

exports.clearCart = async (userId) => {

    const key = getCartKey(userId);

    await redisClient.del(key);

};