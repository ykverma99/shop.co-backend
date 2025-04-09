import mongoose, { Schema } from "mongoose";

const productSchema = Schema({
    productName:{
        type:String,
        required:true,
        trim:true
    },
    productImages:[{
        type:String,
        required:[true,"images is required"],
    }],
    rating:{
        type:String,
    },
    price:{
        type:String,
        required:[true,"Price is required"]
    },
    desctiption:{
        type:String,
        required:[true,"Description is required"],
    },
    stock:{
        type:Number,
        default:0
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category"
    }
   

},{timestamps:true})

export const Product = mongoose.model("Product",productSchema)  