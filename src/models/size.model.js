import mongoose, { Schema } from "mongoose";

const sizeSchema = new Schema({
  label: String,
  order: Number,
});
export const Size = mongoose.model("Size", sizeSchema);
