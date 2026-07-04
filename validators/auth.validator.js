const { body } = require("express-validator");

const registerValidator = [

    body("first_name")
        .trim()
        .notEmpty()
        .withMessage("First name is required"),

    body("last_name")
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),

    body("username")
        .trim()
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters"),

    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("phone")
        .isMobilePhone()
        .withMessage("Invalid phone number"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must contain at least 8 characters"),

    body("role_id")
        .isInt()
        .withMessage("Role ID is required")

];

const verifyOTPValidator = [

    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")

];

module.exports = {
    registerValidator
};

module.exports = {
    registerValidator,
    verifyOTPValidator
};