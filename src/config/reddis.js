const { createClient } = require("redis");
const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
    console.log("✅ Redis Connected Successfully!");
});

redisClient.on("ready", () => {
    console.log("🚀 Redis is Ready!");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Error:");
    console.error(err);
});
async function connectRedis() {
    await redisClient.connect();
}

module.exports = {
    redisClient,
    connectRedis,
};