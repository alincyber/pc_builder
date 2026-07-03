const authService = require("../services/auth.service");

async function verifyOTP(req, res) {

    try {

        const result = await authService.verifyOTP(
            req.body.email,
            req.body.otp
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

}

async function register(req, res) {
    try {

        const result = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            message: result.message,
            userId: result.userId
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
}

module.exports = {
    register,
     verifyOTP
};

