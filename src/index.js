import 'dotenv/config'
// import mongoose from "mongoose"
// import { DB_NAME } from "./constants.js";
import connectDB from './db/index.js';


connectDB()






// import express from "express"


// const app = express()

// ;( async ()=>{

//         try {
//            await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//             app.on("error", (error)=>{
//                 console.log(error);
//                 throw error
            
//             })
//             app.listen(process.env.PORT, ()=>{
//                 console.log(`App is listening on ${process.env.PORT}`)
//             })

//         } catch (error) {
//             console.log(error)
//             throw error
//         }

// })()


//  console.log(`${DB_NAME}`)
//  console.log("hello hiii bye")
//  console.log("bye")