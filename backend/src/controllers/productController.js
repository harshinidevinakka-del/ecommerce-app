import Product from "../models/Product.js";

// ── @desc    Create a new product (Admin only)
// ── @route   POST /api/products
// ── @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, images } = req.body;

    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      stock,
      images: images || [],
      createdBy: req.user.id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get all products (with search, filter, pagination)
// ── @route   GET /api/products
// ── @access  Public
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    // Build dynamic query object
    const query = {};

    // ── Search by keyword (matches name, description, category via text index) ──
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // ── Filter by category ──
    if (category) {
      query.category = category;
    }

    // ── Filter by price range ──
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ── Sorting ──
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { ratings: -1 };

    // ── Pagination ──
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalProducts: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get a single product by ID
// ── @route   GET /api/products/:id
// ── @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    // Handles invalid ObjectId format gracefully
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update a product (Admin only)
// ── @route   PUT /api/products/:id
// ── @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, category, brand, stock, images } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.stock = stock ?? product.stock;
    product.images = images ?? product.images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Delete a product (Admin only)
// ── @route   DELETE /api/products/:id
// ── @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};