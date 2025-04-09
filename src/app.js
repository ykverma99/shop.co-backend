import express, { urlencoded } from 'express'
import cors from "cors"
import {config} from 'dotenv'
import connectDB from './database/connectDB.js'

const app = express()

config({path:"./.env"})
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URI
}))

connectDB()


export default app