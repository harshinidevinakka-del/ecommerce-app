import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ── @desc    Get logged-in user's cart
// ── @route   GET /api/cart
// ── @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price images stock"
    );

    // If user has no cart yet, return an empty one (don't create in DB until they add something)
    if (!cart) {
      return res.json({ user: req.user.id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Add item to cart (or increase quantity if it already exists)
// ── @route   POST /api/cart
// ── @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Verify product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Find or create cart for this user
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price, // snapshot price at time of adding
      });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product", "name price images stock");

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update quantity of a specific cart item
// ── @route   PUT /api/cart/:productId
// ── @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Verify stock before updating
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    item.quantity = quantity;
    await cart.save();
    const populatedCart = await cart.populate("items.product", "name price images stock");

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Remove a single item from cart
// ── @route   DELETE /api/cart/:productId
// ── @access  Private
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    const populatedCart = await cart.populate("items.product", "name price images stock");

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Clear entire cart
// ── @route   DELETE /api/cart
// ── @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};