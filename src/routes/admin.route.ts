import { adminController } from "@/controllers"
import { onlyAllowRole } from "@/middlewares/auth.middleware"
import { Router } from "express"

const adminRoute = Router()

adminRoute.use(onlyAllowRole(["xt", "gs", "xd", "lt"]))
adminRoute.get("/", adminController.adminPage)
adminRoute.get("/xd", adminController.xetduyetPage)
adminRoute.get("/xt", adminController.xacthucPage)
adminRoute.get("/xt/:id", adminController.chitietxacthucPage)
adminRoute.post("/xt/:id/verify", adminController.xacthucApi)
adminRoute.post("/xt/:id/reject", adminController.tuchoiApi)

export default adminRoute
