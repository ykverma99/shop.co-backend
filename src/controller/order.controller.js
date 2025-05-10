import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingInfo, paymentMethod } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.cartItems.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }

  // Explicitly map cart items to order items
  const orderItems = cart.cartItems.map((item) => ({
    product: item.product,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
  }));

  // Calculate delivery date (7 days from now)
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

  const order = await Order.create({
    user: userId,
    orderItems,
    shippingInfo,
    paymentMethod,
    totalAmount: cart.totalPrice,
    deliveredAt: estimatedDeliveryDate,
    orderStatus: "Processing",
  });

  // Clear the cart
  cart.cartItems = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate("orderItems.product", "name price images") // optional
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Fetched user orders"));
});
