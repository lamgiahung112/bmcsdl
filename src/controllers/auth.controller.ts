import { Request, Response } from "express"
import { renderView } from "@/views"
import * as jwt from "@/lib/jwt"

export function loginPage(req: Request, res: Response) {
	if (res.locals.isAuthenticated) {
		return res.redirect("/admin")
	}
	renderView(res, "common/login", null)
}

export async function login(req: Request, res: Response) {
	const { username, password } = req.body

	try {
		let role = ""

		if (
			username === process.env.GIAMSAT_USERNAME &&
			password === process.env.GIAMSAT_PASSWORD
		) {
			role = "gs"
		}
		if (
			username === process.env.XACTHUC_USERNAME &&
			password === process.env.XACTHUC_PASSWORD
		) {
			role = "xt"
		}
		if (
			username === process.env.XETDUYET_USERNAME &&
			password === process.env.XETDUYET_PASSWORD
		) {
			role = "xd"
		}
		if (
			username === process.env.LUUTRU_USERNAME &&
			password === process.env.LUUTRU_PASSWORD
		) {
			role = "lt"
		}

		if (!role) {
			return res.redirect("/login")
		}

		const token = jwt.signToken({ role })
		res.cookie("token", token)
		res.redirect("/admin")
	} catch (error) {
		console.error(error)
		return res.redirect("/login")
	}
}

export function logout(req: Request, res: Response) {
	res.clearCookie("token")
	res.redirect("/login")
}
