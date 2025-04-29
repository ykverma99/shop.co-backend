import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add New Product
const addProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    price,
    description,
    stock,
    colors = [],
    sizes = [],
    styles = [],
  } = req.body;

  if (![productName, price, description, stock].every(Boolean)) {
    throw new ApiError(400, "All fields are required");
  }

  const product = await Product.create({
    productName,
    price,
    description,
    stock,
    sellerId: req.user?._id,
    colors,
    sizes,
    styles,
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const getAllProduct = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  let products;
  if (limit) {
    products = await Product.find().limit(parseInt(limit));
  }
  if (!limit) {
    products = await products.find();
  }

  res.status(200).json({
    success: true,
    products,
  });
});

// // Get All Products
// const getAllProduct = asyncHandler(async (req, res) => {
//   const { limit } = req.query;

//   let query = Product.find().populate("colors sizes styles");

//   if (limit) {
//     query = query.limit(parseInt(limit));
//   }

//   const products = await query;

//   res.status(200).json(new ApiResponse(200, products));
// });

// Get Single Product
const getSingleProduct = asyncHandler(async (req, res) => {
  const { productId, productName } = req.query;

  const product = await Product.findOne({
    $or: [{ _id: productId }, { productName }],
  }).populate("colors sizes styles");

  if (!product) throw new ApiError(404, "Product not found");

  return res.status(200).json(new ApiResponse(200, product));
});

// get Admin Product
const getAdminProducts = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const products = await Product.find({ sellerId: adminId }).populate(
    "colors sizes styles"
  );

  res
    .status(200)
    .json(new ApiResponse(200, products, "Products uploaded by admin"));
});

const filterProducts = asyncHandler(async (req, res) => {
  const { colorId, sizeId, styleId, search } = req.query;

  const filter = {};

  if (colorId) {
    filter.colors = colorId;
  }

  if (sizeId) {
    filter.sizes = sizeId;
  }

  if (styleId) {
    filter.styles = styleId;
  }

  if (search) {
    filter.productName = { $regex: search, $options: "i" }; // case-insensitive
  }

  const products = await Product.find(filter).populate("colors sizes styles");

  res.status(200).json(new ApiResponse(200, products, "Filtered products"));
});

export {
  addProduct,
  getAllProduct,
  getSingleProduct,
  filterProducts,
  getAdminProducts,
};
