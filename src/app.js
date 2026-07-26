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



//routes import

import userRouter from "./routes/user.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import likesRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import videoRouter from "./routes/video.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
//since router was exported as 'default' we were able to change the name to userRouter


//routes declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/likes", likesRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/playlists", playlistRouter)
// since we are using router here that is declared somewhere else, we can't directly use app.get("url", func)

// when user hits '/api/v1/users', control will go to userRouter


export {app}