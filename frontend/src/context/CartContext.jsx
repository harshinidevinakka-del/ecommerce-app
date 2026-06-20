import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import * as cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // ── Fetch cart from backend ──────────────────────────────
  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      const data = await cartService.fetchCart();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, [user]);

  // Fetch cart whenever user logs in/out
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // ── Add item to cart ──────────────────────────────────────
  const addItem = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const data = await cartService.addToCart(productId, quantity);
      setCart(data);
      toast.success("Added to cart");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to cart";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ── Update item quantity ──────────────────────────────────
  const updateItem = async (productId, quantity) => {
    try {
      const data = await cartService.updateCartItem(productId, quantity);
      setCart(data);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update quantity";
      toast.error(message);
    }
  };

  // ── Remove item from cart ──────────────────────────────────
  const removeItem = async (productId) => {
    try {
      const data = await cartService.removeCartItem(productId);
      setCart(data);
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // ── Clear entire cart (used after successful checkout) ─────
  const clearCartState = () => {
    setCart({ items: [] });
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addItem, updateItem, removeItem, clearCartState, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);