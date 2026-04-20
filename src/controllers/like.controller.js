import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const like = await Like.findOne({"video" : videoId})
    if(like){
       const myLike = await Like.findByIdAndDelete(like._id)
        if(!myLike){
        throw new ApiError(501, "Some error happened during unliking the tweet")
       }
    }else{
       const myLike = await Like.create({"video": videoId, "likedBy" : req.user})
       if(!myLike){
        throw new ApiError(501, "Some error happened during liking the tweet")
       }
    }
    
   

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video's like toggled successfully"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const like = await Like.findOne({"comment" : commentId})
    if(like){
       const myLike = await Like.findByIdAndDelete(like._id)
        if(!myLike){
        throw new ApiError(501, "Some error happened during unliking the tweet")
       }
    }else{
       const myLike = await Like.create({"comment": commentId, "likedBy" : req.user})
       if(!myLike){
        throw new ApiError(501, "Some error happened during liking the tweet")
       }
    }
    
   

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment's like toggled successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const like = await Like.findOne({"tweet" : tweetId})
    if(like){
       const myLike = await Like.findByIdAndDelete(like._id)
        if(!myLike){
        throw new ApiError(501, "Some error happened during unliking the tweet")
       }
    }else{
       const myLike = await Like.create({"tweet": tweetId,"likedBy" : req.user})
       if(!myLike){
        throw new ApiError(501, "Some error happened during liking the tweet")
       }
    }
    
   

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet's like toggled successfully"))

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const user = req.user._id

    const likedVideos = await Like.find({"likedBy" : user}).select("-tweet -comment -likedBy -createdAt -updatedAt")

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "all liked videos fetched successfully"))


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}