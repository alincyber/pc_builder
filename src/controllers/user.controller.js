const pool = require("../config/mysql");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
// ==============================
// Get All Users
// ==============================
exports.getUsers = async (req, res) => {
    try {
        const [users] = await pool.query("SELECT * FROM users");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==============================
// Register User
// ==============================
exports.registerUser = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            username,
            email,
            password,
            phone
        } = req.body;

        // ==========================
        // Validation
        // ==========================

        if (
            !first_name ||
            !last_name ||
            !username ||
            !email ||
            !password ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (first_name.length < 2) {
            return res.status(400).json({
                success: false,
                message: "First name must be at least 2 characters."
            });
        }

        if (last_name.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Last name must be at least 2 characters."
            });
        }

        if (username.length < 4) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 4 characters."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }

        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be exactly 10 digits."
            });
        }

        // ==========================
        // Check Existing Email
        // ==========================

        const [existingEmail] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });
        }

        // ==========================
        // Check Existing Username
        // ==========================

        const [existingUsername] = await pool.query(
            "SELECT id FROM users WHERE username = ?",
            [username]
        );

        if (existingUsername.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Username already exists."
            });
        }

        // ==========================
        // Hash Password
        // ==========================

        const hashedPassword = await bcrypt.hash(password, 10);

        // ==========================
        // Insert User
        // ==========================

        const [result] = await pool.query(
            `INSERT INTO users
            (
                first_name,
                last_name,
                username,
                email,
                password,
                phone
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                first_name,
                last_name,
                username,
                email,
                hashedPassword,
                phone
            ]
        );

        // ==========================
        // Success Response
        // ==========================

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                id: result.insertId,
                first_name,
                last_name,
                username,
                email,
                phone
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// login section 

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Email Entered:", email);
        console.log("Password Entered:", password);

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        console.log("Rows:", rows);

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Email not found"
            });
        }

        const user = rows[0];

        console.log("Stored Hash:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password does not match"
            });
        }

        const token = generateToken(user);

        delete user.password;

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getProfile = async (req, res) => {

    try {

        const [rows] = await pool.query(
            `SELECT
                id,
                first_name,
                last_name,
                username,
                email,
                phone
             FROM users
             WHERE id = ?`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user: rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};