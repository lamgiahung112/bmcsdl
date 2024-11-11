import { adminController } from "@/controllers"
import { onlyAllowRole } from "@/middlewares/auth.middleware"
import { Router } from "express"

const adminRoute = Router()

adminRoute.use(onlyAllowRole(["xt", "gs", "xd", "lt"]))
adminRoute.get("/", adminController.adminPage)

export default adminRoute
