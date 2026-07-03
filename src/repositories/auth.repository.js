const pool = require("../config/mysql");
async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
}
async function findUserByUsername(username) {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    return rows[0];
}
async function findUserById(id) {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE id = ?",
        [id]
    );

    return rows[0];
}
async function createUser(userData) {
    const {
        role_id,
        first_name,
        last_name,
        username,
        email,
        phone,
        password
    } = userData;

    const [result] = await pool.execute(
        `
        INSERT INTO users
        (
            role_id,
            first_name,
            last_name,
            username,
            email,
            phone,
            password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            role_id,
            first_name,
            last_name,
            username,
            email,
            phone,
            password
        ]
    );

    return result.insertId;
}

async function verifyUser(userId) {
    await pool.execute(
        `
        UPDATE users
        SET is_verified = TRUE,
            verified_at = NOW()
        WHERE id = ?
        `,
        [userId]
    );
}

module.exports = {
    findUserByEmail,
    findUserByUsername,
    findUserById,
    createUser,
    verifyUser
};