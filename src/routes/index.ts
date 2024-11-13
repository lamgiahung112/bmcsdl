import { Express } from "express"
import authRoute from "./auth.route"
import adminRoute from "./admin.route"
import passportRoute from "./passport.route"
export function initRoutes(app: Express) {
	app.use("/", authRoute)
	app.use("/admin", adminRoute)
	app.use("/passport", passportRoute)
}
