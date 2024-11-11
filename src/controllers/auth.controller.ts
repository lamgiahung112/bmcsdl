import { Request, Response } from "express"
import { renderView } from "@/views"
import * as jwt from "@/lib/jwt"
import { getConnectionFromRole } from "@/db"

export function loginPage(req: Request, res: Response) {
	if (res.locals.isAuthenticated) {
		return res.redirect("/admin")
	}
	renderView(res, "common/login", { name: "John" })
}

export async function login(req: Request, res: Response) {
	const { username, password } = req.body

	const connection = await getConnectionFromRole("gs")
	if (!connection) {
		return res.redirect("/login")
	}

	const result = await connection.execute("SELECT * FROM gs.employee WHERE username = :username", { username })

	if (!result || !result?.rows || result.rows.length === 0) {
		return res.redirect("/login")
	}

	const employee = result.rows[0]
	if (employee.require_reset_password) {
		return res.redirect("/reset-password")
	}
}
