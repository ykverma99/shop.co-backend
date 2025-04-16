import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if ([fullName, email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "Please Fill All Fields");
  }
  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new ApiError(409, "Email Alerady Exist");
  }
  const user = await User.create({
    fullName,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went Wrong in Server");
  }
  return res.status(201).json(new ApiResponse(200, createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "Please Fill All Fields");
  }
  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new ApiError(409, "No User Exist");
  }
  return res.status(201).json(new ApiResponse(200, existUser));
});

export { registerUser, loginUser };
