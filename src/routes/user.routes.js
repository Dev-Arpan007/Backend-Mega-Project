import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router = Router()

router.route("/register").post(registerUser)

// final url==> http://localhost:8000/api/v1/users/register and the registerUser method will run


export default router