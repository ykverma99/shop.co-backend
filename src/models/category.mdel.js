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
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
