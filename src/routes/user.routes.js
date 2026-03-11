import { Router } from "express";
import { 
    logoutUser, 
    registerUser, 
    loginUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory 
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    //file handling with middlewares before calling registerUser method, 2 files: avatar, coverImage
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

// final url==> http://localhost:8000/api/v1/users/register and the registerUser method will run


router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post( refreshAccessToken )

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails)

router.route("/change-avatar").patch(verifyJWT, 
  upload.single("avatar"),  updateUserAvatar)

router.route("/change-cover-image").patch(verifyJWT, 
  upload.single("coverImage"),  updateUserCoverImage)

router.route("/channel/:userName").get(verifyJWT, getUserChannelProfile) //since we are taking userName from url (params), we need the url to be defined like this

router.route("/watch-history").get(verifyJWT, getWatchHistory)
  
export default router