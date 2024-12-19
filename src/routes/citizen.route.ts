import { citizenController } from "@/controllers"
import { softAuthenticate } from "@/middlewares/auth.middleware"
import { Router } from "express"

const citizenRoute = Router()
citizenRoute.use(softAuthenticate())
citizenRoute.get("/", citizenController.loginPage)
citizenRoute.post("/login", citizenController.apiLogin)
citizenRoute.get("/register", citizenController.registerPage)
citizenRoute.post("/register", citizenController.apiRegister)
citizenRoute.get("/dashboard", citizenController.dashboardPage)
citizenRoute.get("/logout", citizenController.logout)
citizenRoute.get("/passport", citizenController.passportPage)
citizenRoute.post("/passport", citizenController.apiRegisterPassport)

export default citizenRoute
