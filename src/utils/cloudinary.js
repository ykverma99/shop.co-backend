import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_CLOUD_KEY, 
    api_secret: CLOUDINARY_CLOUD_SECERET 
});


const uploadOnCloudinary = async(localFile)=>{
    try {
        if(!localFile) throw Error("Not find the Path")
            const res = await cloudinary.uploader.upload(localFile,{resource_type:"auto"})
        console.log("File is Uploaded on cloud",res.url)
        return res
    } catch (error) {
        fs.unlinkSync(localFile)
        return null;
    }
}

export {uploadOnCloudinary}