import { xacthucController } from "@/controllers"
import { onlyAllowRole } from "@/middlewares/auth.middleware"
import { Router } from "express"

const xacthucRoute = Router()

xacthucRoute.use(onlyAllowRole(["xt"]))
xacthucRoute.get("/", xacthucController.xacthucPage)

export default xacthucRoute
