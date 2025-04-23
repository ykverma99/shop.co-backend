import { config } from "dotenv";
config({ path: "./.env" });
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const uploadOnCloudinary = async (localFile) => {
  try {
    if (!localFile) throw Error("Not find the Path");
    const res = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
    });

    // comment this if u want to store the file locally
    if (res) {
      fs.unlinkSync(localFile);
    }
    console.log("File is Uploaded on cloud", res.url);
    return res;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message || error);
    fs.unlinkSync(localFile);
    return null;
  }
};

export { uploadOnCloudinary };
