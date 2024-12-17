import { passportController } from "@/controllers"
import { Router } from "express"

const passportRouter = Router()

passportRouter.get("/", passportController.registerPassportPage)
passportRouter.get("/register", passportController.registerPassportPage)
passportRouter.post("/register", passportController.registerPassport)
export default passportRouter
