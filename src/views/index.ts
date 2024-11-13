import ejs from "ejs"
import { Response } from "express"
import path from "path"
import fs from "node:fs/promises"

export async function renderView(response: Response, template: string, data: any) {
	response.setHeader("Content-Type", "text/html")
	const templatePath = path.join(__dirname, `${template}.ejs`)
	const templateContent = await fs.readFile(templatePath, "utf8")
	response.send(
		ejs.render(templateContent, data, { root: process.cwd() + "/src/views" })
	)
	response.end()
}
