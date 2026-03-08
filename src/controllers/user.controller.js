import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId) //finding in db among all users, that's why using 'User'

        const accessToken = await user.generateAccessToken() // generating for a specific user which we found by id and stored in variable 'user'

        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken //saving the refreshtoken in db 
        // console.log("refreshToken: ", user.refreshToken)
        await user.save({validateBeforeSave: false}) // saving the changes after adding refresh token in db

        // console.log("User with refreshToken: \n", user)

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh tokens")
    }
}


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check is user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refreshtoken fields from response
    // check for user creation
    // return response

    //since req came from a Form: req.body contains all details
    const {fullName, email, userName, password} = req.body

    console.log(email, password, userName)

    // if(fullName === ""){
    //     throw new ApiError(400, "FullName is required")

    // }
    // if(email === ""){
    //     throw new ApiError(400, "Email is required")

    // }
    // if(password === ""){
    //     throw new ApiError(400, "Password is required")

    // }
    // if(userName === ""){
    //     throw new ApiError(400, "UserName is required")

    // }

    //.some() method checks if atleast 1 element in the array field statisfies the given condition
    if (
        [fullName, email, userName, password].some((field) => {
            return (field?.trim() === "")
        } )
    ) {
        
        throw new ApiError(400, "All fields are required")

    }

    // add other validations like proper email format, strong password etc

    const existedUser = await User.findOne({
        $or : [{ userName }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    //from multer: 1st property of avatar array contains proper path
    console.log("\n\nFrom Multer: ", req.files)
//     From Multer:  [Object: null prototype] {
//   avatar: [
//     {
//       fieldname: 'avatar',
//       originalname: 'IMG-20241225-WA0047.jpg',
//       encoding: '7bit',
//       mimetype: 'image/jpeg',
//       destination: './public/temp',
//       filename: 'IMG-20241225-WA0047.jpg',
//       path: 'public\\temp\\IMG-20241225-WA0047.jpg',
//       size: 450082
//     }
//   ],
//   coverImage: [
//     {
//       fieldname: 'coverImage',
//       originalname: '.trashed-1737744484-IMG-20241225-WA0065.jpg',
//       encoding: '7bit',
//       mimetype: 'image/jpeg',
//       destination: './public/temp',
//       filename: '.trashed-1737744484-IMG-20241225-WA0065.jpg',
//       path: 'public\\temp\\.trashed-1737744484-IMG-20241225-WA0065.jpg',
//       size: 1181198
//     }
//   ]
// }
    
    // const avatarLocalPath = req.files?.avatar[0]?.path    // if files exists -> if avatar[0] exists -> store path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path    // if files exists -> if coverImage[0] exists -> store path

    //next approach is better, what if files or avatar/coverImage do not exist
    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalPath = req.files.avatar[0].path
    }

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName, 
        avatar: avatar.url,
        coverImage: coverImage?.url || "", //since no checking is done for coverImage
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // fields that are not required to pass
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Sucessfully")
    )




    



})

const loginUser = asyncHandler(async (req, res)=>{
    // req.body -> data
    // username or email to validate
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email, userName, password} = req.body

    if(!userName && !email){
        throw new ApiError(400, "atleast userName or email required")
    }

    const user = await User.findOne(
        {
            $or: [{userName}, {email}]
        }
    )
    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password) //User = instance for mongoose, does not have the access of this.password // user = instance for 'user' db, has the access of this.password

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    //need to design options for using cookies

    const options = {
        httpOnly: true, // cookie can be modified by server only
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {
            user: loggedInUser, 
            accessToken,
            refreshToken
            },
            "user logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req, res)=>{

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
           
        },
        {
                returnDocument: "after"
        }

    )

    const options = {
        httpOnly: true, // cookie can be modified by server only
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))

})


const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET )
    
        const user = await User.findById(decodedToken?._id) // while creating tokens, we put _id inside them
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken != user?.refreshToken){
            throw new ApiError(401, "RefreshToken is expired or used")
        }
    
        const options = {
            httpOnly: true, // cookie can be modified by server only
            secure: true
        }
    
       const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
       return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", newRefreshToken, options)
       .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newResponseToken},
                "Access token refreshed"
            )
       )
    } catch (error) {
        throw new ApiError(401, error?.message || "unauthorized request")
    }



})


const changeCurrentPassword = asyncHandler(async (req, res) =>{

    const {oldPassword, newPassword, confirmPassword} = req.body

    if(!(newPassword === confirmPassword)){
        throw new ApiError(401, "Confirm-Password should be same with New-Password")
    }

    const user = await User.findById(req.user?._id)
    
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword

    await user.save({validateBeforeSave: false})

    return res.status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))


})

const getCurrentUser = asyncHandler(async (req, res) =>{
    return res.status(200)
    .json(200, req.user, "Current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async (req, res )=>{

    // const {fullName, email, avatar, coverImage} // dont do this, file updation (avatar, coverImage) should have a diff controller

    const {fullName, email} = req.body

    if(!(fullName && email)){
        throw new ApiError(400, "Full-Name, Email both required" )
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName : fullName,
                email : email
            }
        },
        {
            returnDocument: "after"
        }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})


const updateUserAvatar = asyncHandler(async (req, res) =>{

    const avatarLocalPath = req.file?.path // not files array, bcz we are handling a single file

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")   
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading avatar")

    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            returnDocument: "after"
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated succesfully"))


})
const updateUserCoverImage = asyncHandler(async (req, res) =>{

    const coverImageLocalPath = req.file?.path // not files array, bcz we are handling a single file

    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover Image file is missing")   
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading cover Image")

    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            returnDocument: "after"
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated succesfully"))


})



export {
    registerUser,
    loginUser, 
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}


