const { redisClient } = require("../config/redis");

// ======================================
// Get Cache
// ======================================

exports.getCache = async (key) => {

    const data = await redisClient.get(key);

    if (!data) return null;

    return JSON.parse(data);

};

// ======================================
// Set Cache
// ======================================

exports.setCache = async (

    key,

    data,

    expiry = 300

) => {

    await redisClient.set(

        key,

        JSON.stringify(data),

        {

            EX: expiry

        }

    );

};

// ======================================
// Delete Cache
// ======================================

exports.deleteCache = async (key) => {

    await redisClient.del(key);

};