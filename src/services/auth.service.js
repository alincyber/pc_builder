const otpService = require("./otp.service");
const { generateOTP } = require("../helpers/otp.helper");

const userId = await authRepository.createUser(userData);

const otp = generateOTP();

await otpService.saveOTP(userData.email, otp);

console.log("OTP:", otp);

return {
    success: true,
    message: "Registration successful. Verify OTP.",
    userId
};