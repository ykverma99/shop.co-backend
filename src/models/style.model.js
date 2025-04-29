import mongoose, { Schema } from "mongoose";

const styleSchema = new Schema({
  name: String,
});
export const Style = mongoose.model("Style", styleSchema);
