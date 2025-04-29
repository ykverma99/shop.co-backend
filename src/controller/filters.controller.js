import { Color } from "../models/color.model.js";
import { Size } from "../models/size.model.js";
import { Style } from "../models/style.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ---------- Colors ----------
export const addColor = asyncHandler(async (req, res) => {
  const { name, hexCode } = req.body;
  if (!name || !hexCode) throw new ApiError(400, "Name and hexCode required");

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Product images are required");
  }

  const productImages = await Promise.all(
    req.files.map(async (file) => {
      const uploaded = await uploadOnCloudinary(file.path);
      if (!uploaded) throw new ApiError(500, "Image upload failed");
      return uploaded.url;
    })
  );

  const color = await Color.create({ name, hexCode, productImages });
  res.status(201).json(new ApiResponse(201, color, "Color added"));
});

export const getAllColors = asyncHandler(async (req, res) => {
  const colors = await Color.find();
  res.status(200).json(new ApiResponse(200, colors));
});

// ---------- Sizes ----------
export const addSize = asyncHandler(async (req, res) => {
  const { label, order } = req.body;
  if (!label) throw new ApiError(400, "Label is required");

  const size = await Size.create({ label, order });
  res.status(201).json(new ApiResponse(201, size, "Size added"));
});

export const getAllSizes = asyncHandler(async (req, res) => {
  const sizes = await Size.find().sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, sizes));
});

// ---------- Styles ----------
export const addStyle = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new ApiError(400, "Name is required");

  const style = await Style.create({ name });
  res.status(201).json(new ApiResponse(201, style, "Style added"));
});

export const getAllStyles = asyncHandler(async (req, res) => {
  const styles = await Style.find();
  res.status(200).json(new ApiResponse(200, styles));
});
