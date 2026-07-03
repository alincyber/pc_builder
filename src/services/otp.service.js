const { redisClient } = require("../config/redis");

async function saveOTP(email, otp) {

    await redisClient.set(
        `otp:${email}`,
        otp,
        {
            EX: 300
        }
    );

}

async function getOTP(email) {

    return await redisClient.get(`otp:${email}`);

}

async function deleteOTP(email) {

    await redisClient.del(`otp:${email}`);

}

module.exports = {
    saveOTP,
    getOTP,
    deleteOTP
};