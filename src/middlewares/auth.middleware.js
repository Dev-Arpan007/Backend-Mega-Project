import { ApiError } from "../utils/apiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, _, next)=>{   //since res in not being used it is represented as '_'
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        //accesssToken is available in cookie or it is in Header in the following format: Authorization -> Bearer <Token>
        //that's why for the second case we are removing 'Bearer ' to get the token only
        
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken") //decoded token is the accessToken in decoded format which has _id
    
        if(!user){
            throw new ApiError(401, "Invalid access Token")
        }
    
        req.user = user // added the user field in the req so that it can be used to get details like Id, email which will be used in future to log out
    
        next() // this middleware has completed his task, now go for next
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token" )
    }

})