//Express.js Code

import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,  // only origin Ip address(of frontend) can talk to backend
    credentials: true
}))


app.use(express.json({
    limit: "10kb"
}))   
// for form related data
// Reads incoming JSON body data
// ✔️ Converts it into JavaScript object
// ✔️ Stores inside:

// req.body



app.use(express.urlencoded({extended: true, limit: "10kb"}))
// for url related data


app.use(express.static("public"))
// serves static files like html, css

app.use(cookieparser())
//  A small piece of info that the server sstores in user's browser to remember the user


export {app}