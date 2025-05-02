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
    gender,
    colors = [],
    sizes = [],
    styles = [],
  } = req.body;

  if (![productName, price, description, stock, gender].every(Boolean)) {
    throw new ApiError(400, "All fields are required");
  }

  const product = await Product.create({
    productName,
    price,
    description,
    stock,
    gender,
    sellerId: req.user?._id,
    colors,
    sizes,
    styles,
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// Get All Products
// const getAllProduct = asyncHandler(async (req, res) => {
//   const { limit } = req.query;

//   let query = Product.find().populate("colors sizes styles");

//   if (limit) {
//     query = query.limit(parseInt(limit));
//   }

//   const products = await query;

//   res.status(200).json(new ApiResponse(200, products));
// });

// Get All Product With Colors Seprate
const getAllAndFilteredProduct = asyncHandler(async (req, res) => {
  const { colorId, sizeId, styleId, search, limit } = req.query;

  const matchStage = {};

  if (colorId) {
    matchStage.colors = mongoose.Types.ObjectId(colorId);
  }

  if (sizeId) {
    matchStage.sizes = mongoose.Types.ObjectId(sizeId);
  }

  if (styleId) {
    matchStage.styles = mongoose.Types.ObjectId(styleId);
  }

  if (search) {
    matchStage.productName = { $regex: search, $options: "i" };
  }

  const pipeline = [];

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push(
    { $unwind: "$colors" },
    {
      $lookup: {
        from: "colors",
        localField: "colors",
        foreignField: "_id",
        as: "color",
      },
    },
    { $unwind: "$color" },
    {
      $lookup: {
        from: "sizes",
        localField: "sizes",
        foreignField: "_id",
        as: "sizes",
      },
    },
    {
      $lookup: {
        from: "styles",
        localField: "styles",
        foreignField: "_id",
        as: "styles",
      },
    },
    {
      $project: {
        productName: 1,
        price: 1,
        description: 1,
        stock: 1,
        gender: 1,
        sellerId: 1,
        createdAt: 1,
        updatedAt: 1,
        sizes: 1,
        styles: 1,
        color: 1,
      },
    },
    { $sample: { size: 1000 } }
  );

  if (limit) {
    pipeline.push({ $sample: { size: parseInt(limit) } });
  }

  const products = await Product.aggregate(pipeline);

  res.status(200).json(new ApiResponse(200, products, "Filtered products"));
});

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
  getAllAndFilteredProduct,
  getSingleProduct,
  filterProducts,
  getAdminProducts,
};
