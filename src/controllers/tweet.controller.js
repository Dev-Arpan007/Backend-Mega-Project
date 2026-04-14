import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
   
     const user = req?.user._id
     if (!isValidObjectId(user)) {
        throw new ApiError(400, "Invalid userId")
     }
     const content = req.body.content
     console.log("hhhhhhhhhh")
     if(!content || content?.trim() === ""){
        console.log("vvvvvvvvv")
         throw new ApiError(400, "Tweet content missing")
        
     }
 
     const tweet = await Tweet.create({
         "content": content,
         "owner" : user
     })
 
 
     return res
     .status(201)
     .json(new ApiResponse(201, tweet, "Tweet properly posted"))
  

    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if(!userId){
        throw new ApiError(404, "UserId not found")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }
    const userTweets = await Tweet.find({
        owner: userId
    }).sort({createdAt: -1});

    return res.
    status(200)
    .json(
        new ApiResponse(200, userTweets, "All tweets of this user fetched successfully")
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const user = req?.user._id
    const {tweetId} = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId")
    }
    const {updatedContent} = req.body
    if (!updatedContent) {
        throw new ApiError(400, "Updated content missing")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }
    if(tweet.owner.equals(user) ){
        tweet.content = updatedContent
        await tweet.save({validateBeforeSave: false})
    }else{
        throw new ApiError(403, "Not a owner to update Tweet")
    }

    const updatedTweet = await Tweet.findById(tweet._id)
    
    if(updatedTweet?.content !== updatedContent){
        throw new ApiError(401, "Tweet could not be updated")
    }
    return res.
    status(200)
    .json(new ApiResponse(200,updatedTweet, "Tweet Updated Successfully" ))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const user = req?.user._id
    const {tweetId} = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId")
    }
    const delTweet = await Tweet.findById(tweetId)
    if(!delTweet){
        throw new ApiError(404, "Tweet not found")
    }
    if(!delTweet.owner.equals(user)){
        throw new ApiError(403, "Not a owner to delete tweet")
    }

    await delTweet.deleteOne()

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "tweet sucessfully deleted"))


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}