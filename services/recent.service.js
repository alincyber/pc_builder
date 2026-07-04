const { redisClient } = require("../config/redis");

// ======================================
// Add Recently Viewed Product
// ======================================

exports.addRecentProduct = async (userId, productId) => {

    const key = `recent:${userId}`;

    // Remove if already exists
    await redisClient.lRem(key, 0, productId);

    // Add to beginning
    await redisClient.lPush(key, productId);

    // Keep only last 10 products
    await redisClient.lTrim(key, 0, 9);

};

// ======================================
// Get Recently Viewed Products
// ======================================

exports.getRecentProducts = async (userId) => {

    return await redisClient.lRange(

        `recent:${userId}`,

        0,

        -1

    );

};