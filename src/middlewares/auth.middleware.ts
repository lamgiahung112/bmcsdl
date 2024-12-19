import { Request, Response, NextFunction } from "express"
import * as jwt from "@/lib/jwt"

export function onlyAllowRole(roles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (res.locals.isAuthenticated) {
			if (roles.includes(res.locals.role)) {
				return next()
			}

			return res.redirect("/login")
		}

		const token = req.cookies.token

		const decoded = jwt.verifyToken(token)

		if (!decoded || !roles.includes(decoded.role)) {
			return res.redirect("/login")
		}

		res.locals = decoded
		res.locals.isAuthenticated = true
		next()
	}
}

export function softAuthenticate() {
	return (req: Request, res: Response, next: NextFunction) => {
		const token = req.cookies.token
		const decoded = jwt.verifyToken(token)

		if (decoded) {
			res.locals = decoded
			res.locals.isAuthenticated = true
		}
		next()
	}
}
