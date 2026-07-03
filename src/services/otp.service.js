const { redisClient } = require("../config/redis");



// Save OTP
exports.saveOTP = async (email, otp) => {
    await redisClient.set(`otp:${email}`, otp, {
        EX: 300,
    });
};

// Get OTP
exports.getOTP = async (email) => {
    return await redisClient.get(`otp:${email}`);
};

// Delete OTP
exports.deleteOTP = async (email) => {
    await redisClient.del(`otp:${email}`);
};