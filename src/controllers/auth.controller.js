const authService = require("../services/auth.service");
const sessionService =require("../services/session.service");
const blacklistService =require("../services/blacklist.service");
await sessionService.createSession(

    user.id,

    token,

    req

);

await sessionService.deleteSession(

    req.user.id

);

return res.status(200).json({

    success: true,

    message: "Logout Successfully"

});
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

const authHeader = req.headers.authorization;

const token = authHeader.split(" ")[1];

await blacklistService.blacklistToken(token);

await sessionService.deleteSession(req.user.id);

return res.status(200).json({

    success: true,

    message: "Logout Successful"

});
module.exports = {
    register,
     verifyOTP
};

