import { Request, Response } from "express"
import { renderView } from "@/views"
import { getConnectionFromRole } from "@/db"

export async function adminPage(req: Request, res: Response) {
	const connection = await getConnectionFromRole("gs")
	if (!connection) {
		res.clearCookie("token")
		return res.redirect("/login")
	}
	const result = await connection.execute("SELECT * FROM gs.employee")
	renderView(res, "admin/index", { role: JSON.stringify(result?.rows ?? "1") })
}
