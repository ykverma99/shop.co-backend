import mongoose, { Schema } from "mongoose";

const productSchema = Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productImages: [
      {
        type: String,
        required: [true, "images is required"],
      },
    ],
    rating: {
      type: String,
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    stock: {
      type: Number,
      default: 0,
    },
    colors: [{ type: Schema.Types.ObjectId, ref: "Color" }],
    sizes: [{ type: Schema.Types.ObjectId, ref: "Size" }],
    styles: [{ type: Schema.Types.ObjectId, ref: "Style" }],
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
