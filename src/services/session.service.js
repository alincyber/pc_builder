const { redisClient } = require("../config/redis");

// =====================================
// Create Session
// =====================================

exports.createSession = async (
    userId,
    token,
    req
) => {

    const session = {

        userId,

        token,

        ip: req.ip,

        device: req.headers["user-agent"],

        loginAt: new Date()

    };

    await redisClient.set(

        `session:${userId}`,

        JSON.stringify(session),

        {

            EX: 60 * 60 * 24 // 24 Hours

        }

    );

};

// =====================================
// Get Session
// =====================================

exports.getSession = async (userId) => {

    const session = await redisClient.get(

        `session:${userId}`

    );

    if (!session) return null;

    return JSON.parse(session);

};

// =====================================
// Delete Session
// =====================================

exports.deleteSession = async (userId) => {

    await redisClient.del(

        `session:${userId}`

    );

};