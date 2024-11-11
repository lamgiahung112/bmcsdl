import { Router } from "express"
import { authController } from "@/controllers"
import { softAuthenticate } from "@/middlewares/auth.middleware"

const authRoute = Router()

authRoute.get("/login", softAuthenticate(), authController.loginPage)
authRoute.post("/login", authController.login)

export default authRoute
