import dotenv from "dotenv"
import express from "express"
import path from "path"
import { initializeConnectionPool } from "@/db"
import { initRoutes } from "./routes"
import cookieParser from "cookie-parser"

const app = express()

dotenv.config()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "public")))

initRoutes(app)

initializeConnectionPool().then(() => {
	app.listen(3000, () => {
		console.log("Server is running on port 3000")
	})
})
