import 'dotenv/config'
import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Error ", error)
        process.exit(1) //DB is not properly connected, no need to start the sever ,exit(1)=unsuccessful termination and exit(0)=unsuccessful
    }
}

export default connectDB