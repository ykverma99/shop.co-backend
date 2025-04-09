import mongoose, { Schema } from "mongoose";

const addressSchema = Schema({
    addressName:{
        type:String,
        required:true,
        trim:true
    },
    streetAddress:{
        type:String,
        required:[true,"Address is required"],
        trim:true,
    },
    floor:{
        type:String,
        trim:true
    },
    pincode:{
        type:String,
        required:[true,"PinCode is required"]
    },
    cityTown:{
        type:String,
        required:[true,"City or Town is required"],
    },
    mobileNumber:{
        type:String,
        required:[true,"Mobile no is required"],
    },
   

},{timestamps:true})

export const Address = mongoose.model("Address",addressSchema)  