import { citizenController } from "@/controllers"
import { Router } from "express"

const citizenRoute = Router()
citizenRoute.get("/", citizenController.loginPage)
citizenRoute.get("/register", citizenController.registerPage)
citizenRoute.post("/register", citizenController.apiRegister)

export default citizenRoute
