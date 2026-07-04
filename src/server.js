require("dotenv").config();

const app = require("./app");

const mysql = require("./config/mysql");
const connectMongoDB = require("./config/mongo");
const { connectRedis } = require("./config/redis");


const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {

        const connection = await mysql.getConnection();
        console.log("✅ MySQL Connected");
        connection.release();

        await connectMongoDB();

        await connectRedis();
        const rateLimiter = require("./middleware/rateLimiter.middleware");

app.use(rateLimiter);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

    } catch (err) {
        console.error(err);
    }
}

startServer();