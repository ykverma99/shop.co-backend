import mongoose from "mongoose"
import { dataBaseUri, jwtAccessExpiry } from "../constants.js"

const connectDB = async()=>{
    try {
        if(dataBaseUri){
            console.log("first")
            console.log(dataBaseUri)
        }
        console.log(jwtAccessExpiry)
        await mongoose.connect(process.env.DATABASE_URI)
        console.log('Data Base is Connected')
    } catch (error) {
        console.log("Mongoose connection error",error)
        process.exit(1)
    }
}

export default connectDB