import mongoose, {isValidObjectId} from "mongoose"
import {Subscription} from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    if (channelId === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (existingSubscription) {
        await existingSubscription.deleteOne()

        return res
        .status(200)
        .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"))
    }

    const subscription = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    })

    if (!subscription) {
        throw new ApiError(500, "Something went wrong while subscribing")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "fullName userName avatar")
        .sort({ createdAt: -1 })

    return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Channel subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriberId")
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "fullName userName avatar")
        .sort({ createdAt: -1 })

    return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
