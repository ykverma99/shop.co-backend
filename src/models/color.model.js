import mongoose, { Schema } from "mongoose";

const colorSchema = new Schema({
  name: String,
  hexCode: String,
  productImages: [
    {
      type: String,
      required: [true, "images is required"],
    },
  ],
});
export const Color = mongoose.model("Color", colorSchema);
