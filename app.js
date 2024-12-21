import express from "express";
import { getProducts ,getProduct} from "./api/products.js";
import Redis from "ioredis";
import { getCachedData, rateLimit } from "./middleware/redis.js";

const REDIS_URL = "rediss://default:@:"
export const redis = new Redis(REDIS_URL);

redis.on("connect", () => {
  console.log("Redis is connected");
});

const app = express();

app.get("/", rateLimit({limit:10,timer:60,key:"home"}),async (req, res) => {
  res.send("Hello World!");
});

// Example 
app.get("/products",rateLimit({limit:10,timer:60,key:"products"}), getCachedData("products"),async (req, res) => {
  const products = await getProducts();
  redis.setex("products",20,JSON.stringify(products));
  return res.json(products);
});

// Exmplae
app.get("/product/:id",rateLimit({limit:10,timer:60,key:"product"}), async (req, res) => {
  const { id } = req.params;
  let product = await redis.get(`product:${id}`);

  if (product) {
    return res.json(JSON.parse(product));
  }
  
  product = await getProduct(id);
  // redis.setex(`product:${id}`,20, JSON.stringify(product));
  redis.set(`product:${id}`, JSON.stringify(product));
  return res.json(product);
})

app.get("/order/:id",rateLimit({limit:10,timer:60,key:"order"}), async (req, res) => {
  const id= req.params.id;
  const key = `product:${id}`;

  await redis.del(key);
  return res.json(
    {
      message: `Order Added Successfully ${id}`
    }
  );
})

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
