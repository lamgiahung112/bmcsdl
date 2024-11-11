import { Express } from "express"
import authRoute from "./auth.route"
import xacthucRoute from "./xacthuc.route"
import adminRoute from "./admin.route"

export function initRoutes(app: Express) {
	app.use("/", authRoute)
	app.use("/admin/xacthuc", xacthucRoute)
	app.use("/admin", adminRoute)
}
