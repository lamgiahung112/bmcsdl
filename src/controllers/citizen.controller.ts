import { renderView } from "@/views"
import { Request, Response } from "express"
import { error } from "node:console"

// Dang nhap
export function loginPage(req: Request, res: Response) {
	if (res.locals.isAuthenticated) {
		return res.redirect("/citizen-dashboard")
	}
	renderView(res, "citizen/login", null)
}

// Dang ki tai khoan cu dan online
export function registerPage(req: Request, res: Response) {
	if (res.locals.isAuthenticated) {
		return res.redirect("/citizen-dashboard")
	}
	renderView(res, "citizen/register", null)
}

// api dang ki tai khoan
export function apiRegister(req: Request, res: Response) {
	const { identity_id, password, "confirm-password": confirmPassword } = req.body

	if (password !== confirmPassword) {
		renderView(res, "citizen/register", {
			error: "Mật khẩu phải trùng với nhau",
		})
		return
	}
	renderView(res, "citizen/register", {
		error: "test failed",
	})
}
