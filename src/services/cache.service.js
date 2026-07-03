const { redisClient } = require("../config/redis");

// ======================================
// Set Cache
// ======================================

exports.setCache = async (key, value, ttl = 300) => {

    await redisClient.set(
        key,
        JSON.stringify(value),
        {
            EX: ttl
        }
    );

};

// ======================================
// Get Cache
// ======================================

exports.getCache = async (key) => {

    const data = await redisClient.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data);

};

// ======================================
// Delete Cache
// ======================================

exports.deleteCache = async (key) => {

    await redisClient.del(key);

};

// ======================================
// Delete Multiple Cache Keys
// ======================================

exports.deleteByPattern = async (pattern) => {

    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {

        await redisClient.del(keys);

    }

};