import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Data Base is Connected");
  } catch (error) {
    console.log("Mongoose connection error", error);
    process.exit(1);
  }
};

export default connectDB;
