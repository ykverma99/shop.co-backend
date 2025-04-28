import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addUserAddress = asyncHandler(async (req, res) => {
  const { addressName, streetAddress, floor, pincode, cityTown, mobileNumber } =
    req.body;

  if (
    [addressName, streetAddress, floor, pincode, cityTown, mobileNumber].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(401, "Fill all the fields");
  }

  if (mobileNumber.length !== 10) {
    throw new ApiError(402, "Mobile Number is not Valid");
  }

  const existingAddress = await Address.findOne({ user: req.user._id });

  if (existingAddress) {
    throw new ApiError(
      400,
      "User already has an address. Cannot add another one."
    );
  }
  // Start Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newAddress = await Address.create(
      [
        {
          addressName,
          streetAddress,
          floor,
          pincode,
          cityTown,
          mobileNumber,
          user: req.user._id,
        },
      ],
      { session }
    );

    const address = newAddress[0]; // because create with array returns array

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { address: address._id },
      { new: true, session }
    )
      .populate("address")
      .select("-password");

    if (!address || !updatedUser) {
      throw new ApiError(500, "Failed to save address or update user");
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { address, user: updatedUser },
          "Address saved and User updated successfully"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Transaction failed");
  }
});

export { addUserAddress };
