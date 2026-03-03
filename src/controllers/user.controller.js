import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
        [fullName, email, userName, paaword].some((field) => {
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
    const avatarLocalPath = req.files?.avatar[0]?.path

    const coverImageLocalPath = req.files?.coverImage[0]?.path

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


export {registerUser}


