import { Express } from "express"
import authRoute from "./auth.route"
import adminRoute from "./admin.route"
import passportRoute from "./passport.route"
import citizenRoute from "./citizen.route"
export function initRoutes(app: Express) {
	app.use("/", authRoute)
	app.use("/admin", adminRoute)
	app.use("/passport", passportRoute)
	app.use("/citizen", citizenRoute)
}
