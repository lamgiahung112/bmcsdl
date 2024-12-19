import dotenv from "dotenv"
import express from "express"
import path from "path"
import { initRoutes } from "./routes"
import cookieParser from "cookie-parser"
import {
	CuDanDataSource,
	GiamsatDataSource,
	LuuTruDataSource,
	XacThucDataSource,
	XetDuyetDataSource,
} from "./db"

const app = express()

dotenv.config()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "public")))

initRoutes(app)

GiamsatDataSource.initialize()
	.then(() => {
		return LuuTruDataSource.initialize()
	})
	.then(() => {
		return XacThucDataSource.initialize()
	})
	.then(() => {
		return XetDuyetDataSource.initialize()
	})
	.then(() => {
		return CuDanDataSource.initialize()
	})
	.then(() => {
		app.listen(3000, () => {
			console.log("Server is running on port 3000")
		})
	})
	.catch((err) => {
		console.error(err)
	})
