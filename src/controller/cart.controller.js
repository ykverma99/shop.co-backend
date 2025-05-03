import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const addOrUpdateCart = asyncHandler(async (req, res) => {
  const { productId, quantity, colorId, sizeId } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(400, "Product ID and quantity are required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: product._id,
          quantity,
          price: product.price,
          color: colorId,
          size: sizeId,
        },
      ],
      totalPrice: product.price * quantity,
      totalItems: 1,
    });
  } else {
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity = Number(quantity);
    } else {
      cart.cartItems.push({
        product: product._id,
        quantity,
        price: product.price,
        color: colorId,
        size: sizeId,
      });
    }

    cart.totalItems = cart.cartItems.length;
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart updated successfully"));
});

const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate([
      {
        path: "cartItems.product",
        select: "productName price",
      },
      {
        path: "cartItems.color",
        select: "name hexCode",
      },
      {
        path: "cartItems.size",
        select: "label value",
      },
    ])
    .select("-__v");

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Fetched user cart successfully"));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  cart.cartItems.splice(itemIndex, 1);

  // Recalculate totals
  cart.totalItems = cart.cartItems.length;
  cart.totalPrice = cart.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.cartItems = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

export { addOrUpdateCart, getUserCart, removeItemFromCart, clearCart };
