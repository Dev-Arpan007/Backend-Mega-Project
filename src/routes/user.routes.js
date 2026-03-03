import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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


export default router