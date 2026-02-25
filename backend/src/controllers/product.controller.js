import Product from "../models/product.js";
import User from "../models/user.js";
import Invoice from "../models/invoice.js";
import { redis, getKey } from "../config/redis.js";
import { clearCache } from "../middleware/cache.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, unit, description, purchasePrice } = req.body;
    const shopId = req.user.shopId;

    const product = new Product({
      shopId, name, price,
      purchasePrice: purchasePrice || 0,
      stock, unit, description
    });

    await product.save();
    await clearCache(`products:${shopId}`);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const cacheKey = getKey(`products:${req.user.shopId}:${search || "all"}`);
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Redis Cache Hit: products");
      return res.json(cached);
    }

    const { search: searchQuery } = req.query; // renaming to avoid conflict
    const query = { shopId: req.user.shopId };

    if (searchQuery) {
      query.$or = [{ name: { $regex: searchQuery, $options: "i" } }];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    await redis.set(cacheKey, products, { ex: 3600 }); // Cache for 1 hour
    console.log("Redis Cache Miss: products. Cached result.");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const cacheKey = getKey(`product:${req.params.id}`);
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Redis Cache Hit: product");
      return res.json(cached);
    }

    const product = await Product.findOne({ _id: req.params.id, shopId: req.user.shopId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    await redis.set(cacheKey, product, { ex: 3600 });
    console.log("Redis Cache Miss: product. Cached result.");
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, stock, unit, description, purchasePrice } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shopId: req.user.shopId },
      { name, price, purchasePrice, stock, unit, description },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    await clearCache(`products:${req.user.shopId}`);
    await redis.del(getKey(`product:${req.params.id}`));
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, shopId: req.user.shopId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    await clearCache(`products:${req.user.shopId}`);
    await redis.del(getKey(`product:${req.params.id}`));
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

export const getPublicProducts = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await User.findOne({ shopId }).select("companyName");
    const shopName = shop?.companyName || "Unknown Shop";

    const products = await Product.find({ shopId })
      .select("name price stock unit description")
      .sort({ createdAt: -1 });

    res.json({ shopName, products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch public products" });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const matchStage = { shopId: req.user.shopId, isDeleted: { $ne: true } };

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      matchStage.createdAt = { $gte: start, $lte: end };
    }

    const stats = await Invoice.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          sold: { $sum: "$items.qty" },
          revenue: { $sum: "$items.total" }
        }
      },
      { $sort: { sold: -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
