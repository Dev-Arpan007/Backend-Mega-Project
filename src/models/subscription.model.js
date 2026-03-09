import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one who is subscribing, stores mainly the id of the user who is subscribing
        ref: "User"
    },

    channel: {
        type: Schema.Types.ObjectId, // channel to whom the subscriber is subscribing
        //same here like previous and to the others also where reference is used
        ref: "User"
        
    }


},{timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)