import { Router } from "express"
import { authController } from "@/controllers"
import { softAuthenticate } from "@/middlewares/auth.middleware"

const authRoute = Router()
authRoute.get("/", authController.rootPage)
authRoute.get("/login", softAuthenticate(), authController.loginPage)
authRoute.post("/login", authController.login)
authRoute.get("/logout", authController.logout)

export default authRoute
