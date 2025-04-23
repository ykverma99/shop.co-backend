import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  const { productName, price, description, stock } = req.body;

  if (
    [productName, price, description, stock].some(
      (fields) => fields.trim() === ""
    )
  ) {
    throw new ApiError("400", "All Fields are required");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Product images are required");
  }

  const productImages = await Promise.all(
    req.files.map(async (file) => {
      const cloudImage = await uploadOnCloudinary(file.path);
      return cloudImage.url;
    })
  );
  const product = await Product.create({
    productName,
    price,
    desctiption: description,
    stock,
    sellerId: req.user?._id,
    productImages,
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export { addProduct };
