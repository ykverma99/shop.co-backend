import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

var option = {
  httpOnly: true,
  secure: true,
};

const genrateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while genrating token");
  }
};

// Register User
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

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "Please Fill All Fields");
  }
  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new ApiError(409, "No User Exist");
  }
  const isValidPassword = await existUser.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(409, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(
    existUser._id
  );

  const user = await User.findById(existUser._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { user: user, accessToken, refreshToken },
        "User Logged In"
      )
    );
});

// logOut User
const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(201)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken = req.cookies?.accessToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodeToken = jwt.verify(
    incommingRefreshToken,
    process.env.JWT_REFRESH_TOKEN
  );

  const user = await User.findById(decodeToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incommingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const { accessToken, refreshToken } = genrateAccessAndRefreshToken(user._id);

  return res
    .status(201)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(200, { accessToken, refreshToken }, "User Logged In")
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPasswrod } = req.body;
  if ([oldPassword, newPasswrod].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "Fill the Fields");
  }
  const user = await User.findById(req.user?._id);
  const comparePassword = await user.isPasswordCorrect(oldPassword);
  if (!comparePassword) {
    throw new ApiError(401, "Old Password is Incorrect");
  }
  user.password = newPasswrod;
  await user.save({ validateBeforeSave: true });

  return res.status(200).json(ApiResponse(200, {}, "Password is Changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) {
    throw new ApiError(400, "No user found");
  }
  return res.status(200).json(ApiResponse(200, user, "Current user"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findById({}).select("-password");
  if (!users) {
    throw new ApiError(400, "No users found");
  }
  return res.status(200).json(ApiResponse(200, users, "All user"));
});

const accountDetailsUpdate = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(ApiResponse(200, user, "Account Details Updated"));
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
};
