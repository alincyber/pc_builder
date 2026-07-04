const { redisClient } = require("../config/redis");

// =====================================
// Add Token To Blacklist
// =====================================

exports.blacklistToken = async (token) => {

    await redisClient.set(

        `blacklist:${token}`,

        "true",

        {

            EX: 60 * 60 * 24 // 24 Hours

        }

    );

};

// =====================================
// Check Token
// =====================================

exports.isBlacklisted = async (token) => {

    const exists = await redisClient.get(

        `blacklist:${token}`

    );

    return !!exists;

};