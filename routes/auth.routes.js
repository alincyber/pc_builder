const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
    registerValidator,
    verifyOTPValidator
} = require("../validators/auth.validator");

router.post("/register", authController.register);

router.post("/login", loginLimiter, authController.login);

router.post("/logout", authController.logout);

router.post("/send-otp", authController.sendOTP);

router.post("/verify-otp", authController.verifyOTP);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.get("/profile",verifyToken,blacklistMiddleware,sessionMiddleware,authController.profile);

router.put("/profile", authController.updateProfile);

router.post(
    "/verify-otp",
    verifyOTPValidator,
    validate,
    authController.verifyOTP
);

module.exports = router;