import { redis } from "../app.js";

export const getCachedData = (key) => async (req, res, next) => {
  let products = await redis.get(key);

  if (products) {
    console.log("Get from cache");
    return res.json({
      products: JSON.parse(products),
    });
  }
  next();
};

export const rateLimit = ({limit, timer,key}) => async (req, res, next) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const fullKey = `${clientIp}${key}:request_count`;
  const request = await redis.incr(fullKey);
    
  if (request === 1) {
    await redis.expire(fullKey, timer);
  }

  let timingRemaining = await redis.ttl(fullKey);

    // Handle edge cases for TTL
    if (timingRemaining < 0) {
    timingRemaining = 0; // Default to 0 seconds if TTL is not set or key doesn't exist
    }

  if (request > limit) {
    return res
      .status(429)
      .send(`Too many requests, try again in ${timingRemaining} seconds`);
  }
  next();
};
