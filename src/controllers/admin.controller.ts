import { getDataSource } from "@/db"
import CitizenIdentityRepository from "@/repositories/citizen_identity.repository"
import PassportRepository from "@/repositories/passport.repository"
import PassportRegistrationAttemptRepository from "@/repositories/passport_registration_attempt.repository"
import { renderView } from "@/views"
import { Request, Response } from "express"

export async function adminPage(req: Request, res: Response) {
	res.redirect(`/admin/${res.locals.role}`)
}

// ============================ Xét Duyệt ============================
export async function xetduyetPage(req: Request, res: Response) {
	const page = parseInt(req.query.page as string) || 1
	const perPage = parseInt(req.query.per_page as string) || 10
	const status = req.query.status as string | undefined
	const name = req.query.name as string | undefined

	if (res.locals.role !== "xd" && res.locals.role !== "gs") {
		return renderView(res, "admin/not_authorized", {
			path: `/admin${req.path}`,
		})
	}

	const dataSource = getDataSource(res.locals.role)
	const passportRegistrationAttemptRepository =
		new PassportRegistrationAttemptRepository(dataSource!)
	const attempts = await passportRegistrationAttemptRepository.paginate({
		page,
		perPage,
		filters: {
			status,
			name,
		},
	})
	renderView(res, "admin/xetduyet", {
		path: `/admin${req.path}`,
		attempts: attempts.items,
		total: attempts.total,
		page,
		perPage,
		filters: {
			status,
			name,
		},
	})
}

export async function chitietxetduyetPage(req: Request, res: Response) {
	const id = req.params.id

	if (res.locals.role !== "xd" && res.locals.role !== "gs") {
		return renderView(res, "admin/not_authorized", {
			path: `/admin${req.path}`,
		})
	}

	const dataSource = getDataSource(res.locals.role)
	const passportRegistrationAttemptRepository =
		new PassportRegistrationAttemptRepository(dataSource!)
	const attempt = await passportRegistrationAttemptRepository.findOne(id)
	if (!attempt || !attempt.identity_id) {
		return res.redirect(`/admin/xd`)
	}
	const passportRepository = new PassportRepository(dataSource!)
	const citizenIdentityRepository = new CitizenIdentityRepository(dataSource!)
	const citizenIdentity = await citizenIdentityRepository.findOne(attempt.identity_id)
	const passports = await passportRepository.getCitizenPassports(
		citizenIdentity?.citizen_id ?? ""
	)

	renderView(res, "admin/chitietxetduyet", {
		path: `/admin${req.path}`,
		attempt,
		citizenIdentity,
		citizen: citizenIdentity?.citizen,
		passports,
	})
}

export async function duyetApi(req: Request, res: Response) {
	const id = req.params.id

	if (res.locals.role !== "xd" && res.locals.role !== "gs") {
		res.status(401).json({
			message: "Không có quyền truy cập",
		})
		return
	}
	const dataSource = getDataSource(res.locals.role)
	const passportRegistrationAttemptRepository =
		new PassportRegistrationAttemptRepository(dataSource!)
	await passportRegistrationAttemptRepository.accept(id)
	res.status(200).json({
		message: "Duyệt thành công",
	})
}

// ============================ Xác Thực ============================
export async function xacthucPage(req: Request, res: Response) {
	const page = parseInt(req.query.page as string) || 1
	const perPage = parseInt(req.query.per_page as string) || 10
	const status = req.query.status as string | undefined
	const name = req.query.name as string | undefined

	if (res.locals.role !== "xt" && res.locals.role !== "gs") {
		return renderView(res, "admin/not_authorized", {
			path: `/admin${req.path}`,
		})
	}

	const dataSource = getDataSource(res.locals.role)
	const passportRegistrationAttemptRepository =
		new PassportRegistrationAttemptRepository(dataSource!)
	const attempts = await passportRegistrationAttemptRepository.paginate({
		page,
		perPage,
		filters: {
			status,
			name,
		},
	})
	renderView(res, "admin/xacthuc", {
		path: `/admin${req.path}`,
		attempts: attempts.items,
		total: attempts.total,
		page,
		perPage,
		filters: {
			status,
			name,
		},
	})
}

export async function chitietxacthucPage(req: Request, res: Response) {
	const id = req.params.id

	if (res.locals.role !== "xt" && res.locals.role !== "gs") {
		return renderView(res, "admin/not_authorized", {
			path: `/admin${req.path}`,
		})
	}

	const dataSource = getDataSource(res.locals.role)
	const passportRegistrationAttemptRepository =
		new PassportRegistrationAttemptRepository(dataSource!)
	const attempt = await passportRegistrationAttemptRepository.findOne(id)
	if (!attempt || !attempt.identity_id) {
		return res.redirect(`/admin/xt`)
	}
	const passportRepository = new PassportRepository(dataSource!)
	const citizenIdentityRepository = new CitizenIdentityRepository(dataSource!)
	const citizenIdentity = await citizenIdentityRepository.findOne(attempt.identity_id)
	const passports = await passportRepository.getCitizenPassports(
		citizenIdentity?.citizen_id ?? ""
	)

	renderView(res, "admin/chitietxacthuc", {
		path: `/admin${req.path}`,
		attempt,
		citizenIdentity,
		citizen: citizenIdentity?.citizen,
		passports,
	})
}

export async function xacthucApi(req: Request, res: Response) {
	const id = req.params.id

	if (res.locals.role !== "xt" && res.locals.role !== "gs") {
		res.status(401).json({
			message: "Không có quyền truy cập",
		})
		return
	}

	const dataSource = getDataSource(res.locals.role)
	const passportRegistrationAttemptRepository =
		new PassportRegistrationAttemptRepository(dataSource!)
	await passportRegistrationAttemptRepository.verify(id)
	res.status(200).json({
		message: "Xác thực thành công",
	})
}

export async function tuchoiApi(req: Request, res: Response) {
	const id = req.params.id

	if (res.locals.role !== "xt" && res.locals.role !== "gs") {
		res.status(401).json({
			message: "Không có quyền truy cập",
		})
		return
	}

	const dataSource = getDataSource(res.locals.role)
	const passportRegistrationAttemptRepository =
		new PassportRegistrationAttemptRepository(dataSource!)
	await passportRegistrationAttemptRepository.reject(id, req.body.reason)
	res.status(200).json({
		message: "Từ chối thành công",
	})
}

// ============================ Lưu Trữ ============================
export async function luutruPage(req: Request, res: Response) {
	const page = parseInt(req.query.page as string) || 1
	const perPage = parseInt(req.query.per_page as string) || 10
	const status = req.query.status as string | undefined
	const name = req.query.name as string | undefined

	if (res.locals.role !== "lt" && res.locals.role !== "gs") {
		return renderView(res, "admin/not_authorized", {
			path: `/admin${req.path}`,
		})
	}

	const dataSource = getDataSource(res.locals.role)
	const passportRegistrationAttemptRepository =
		new PassportRegistrationAttemptRepository(dataSource!)
	const attempts = await passportRegistrationAttemptRepository.paginate({
		page,
		perPage,
		filters: {
			status,
			name,
		},
	})
	renderView(res, "admin/luutru", {
		path: `/admin${req.path}`,
		attempts: attempts.items,
		total: attempts.total,
		page,
		perPage,
		filters: {
			status,
			name,
		},
	})
}

// ============================ Giám Sát ============================
