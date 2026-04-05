const redis = require("redis");
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  password: process.env.REDIS_PASSWORD || undefined
});

redisClient.connect().catch(console.error);

redisClient.on("error", function (error) {
  console.error("Redis Client Error", error);
});

redisClient.on("connect", function () {
  console.log("Redis connected successfully");
});

module.exports = redisClient;