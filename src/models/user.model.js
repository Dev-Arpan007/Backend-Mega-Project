import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema({

    userName : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // making the key(username) searchable
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
         type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatar:{
        type: String, //cloudinary url
        required: true 
    },
    coverImage: {
        type: String // cloudinary url
    },
    watchHistory:[ // stores the id's of videos
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required:[true, "Password is required"]
    },
     refreshToken:{
        type: String
     }  
},
{
    timestamps: true
})

// middleware: just before saving the updation in password field, encrypt it with 10 rounds
// in middleware we must use next() at last, next() is in func(err,req,res,next)
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next
    
    this.password = await bcrypt.hash(this.password, 10)
    return next
})

//middleware: making a method on UserSchema to compare the input passwrod with the encrypted password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// syntax for jwt.sign ==> jwt.sign(payload, secret, options)
// payload: encoded data, used to identify logged-in user
// inside mongodb 'id' is stored as '_id'
userSchema.methods.generateAccessToken = async function(){
        return jwt.sign({
            _id: this._id,
            email:this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function(){
        return jwt.sign({
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema )