import mongoose, { Schema } from "mongoose";

const colorSchema = new Schema({
  name: String,
  hexCode: String,
});
export const Color = mongoose.model("Color", colorSchema);
