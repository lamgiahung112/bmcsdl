import { Request, Response } from "express"
import { getConnectionFromRole } from "@/db"
import OracleDB from "oracledb"

export async function xacthucPage(req: Request, res: Response) {
	const connection = await getConnectionFromRole("xd")
	if (!connection) {
		return res.redirect("/login")
	}

	const result = await connection.execute("SELECT * FROM gs.citizen", [], {
		outFormat: OracleDB.OUT_FORMAT_OBJECT,
	})

	res.json({
		data: result.rows,
	})
}
