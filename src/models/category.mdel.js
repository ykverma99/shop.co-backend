import mongoose, { Schema } from "mongoose";

const categorySchema = Schema(
  {
    categoryName: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    sizes: [
      {
        type: String,
      },
    ],
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
