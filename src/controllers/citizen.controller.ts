import { CuDanDataSource, GiamsatDataSource } from "@/db"
import { CitizenIdentity } from "@/entities/citizen_identity.entity"
import { renderView } from "@/views"
import { Request, Response } from "express"
import * as bcrypt from "bcrypt"
import { Citizen } from "@/entities/citizen.entity"
import * as jwt from "@/lib/jwt"
import { PassportRegistrationAttempt } from "@/entities/passport_registration_attempt.entity"
import { randomUUID } from "crypto"

// Dang nhap
export function loginPage(req: Request, res: Response) {
	if (res.locals.isAuthenticated) {
		return res.redirect("/citizen/ashboard")
	}
	renderView(res, "citizen/login", {
		err: "",
	})
}

export async function apiLogin(req: Request, res: Response) {
	if (res.locals.isAuthenticated) {
		return res.redirect("/citizen/dashboard")
	}

	const { identity_id, password } = req.body

	const identity = await CuDanDataSource.getRepository(CitizenIdentity).findOne({
		where: {
			id: identity_id,
		},
		relations: {
			citizen: true,
		},
	})

	if (!identity || !identity.citizen || !identity.citizen.pwd) {
		renderView(res, "citizen/login", {
			err: "Cư dân không tồn tại hoặc chưa đăng kí trên cổng thông tin cư dân online",
		})
		return
	}

	const isCorrectPwd = await bcrypt.compare(password, identity.citizen.pwd)
	if (!isCorrectPwd) {
		renderView(res, "citizen/login", {
			err: "Cư dân không tồn tại hoặc chưa đăng kí trên cổng thông tin cư dân online",
		})
		return
	}

	const token = jwt.signToken({ role: "cd", citizen_id: identity.citizen.id })
	res.cookie("token", token)
	res.redirect("/citizen/dashboard")
}

// Dang ki tai khoan cu dan online
export function registerPage(req: Request, res: Response) {
	if (res.locals.isAuthenticated) {
		return res.redirect("/citizen/dashboard")
	}
	renderView(res, "citizen/register", {
		err: "",
	})
}

// api dang ki tai khoan
export async function apiRegister(req: Request, res: Response) {
	if (res.locals.isAuthenticated) {
		return res.redirect("/citizen/dashboard")
	}
	const { identity_id, password, "confirm-password": confirmPassword } = req.body

	if (password !== confirmPassword) {
		renderView(res, "citizen/register", {
			err: "Mật khẩu phải trùng với nhau",
		})
		return
	}

	// get identity from id, get the citizen relationship too
	const identity = await CuDanDataSource.getRepository(CitizenIdentity).findOne({
		where: {
			id: identity_id,
		},
		relations: {
			citizen: true,
		},
	})

	if (!identity) {
		renderView(res, "citizen/register", {
			err: "CCCD/CMND không tồn tại",
		})
		return
	}

	if (!identity.citizen || identity.citizen?.pwd) {
		renderView(res, "citizen/register", {
			err: "Cư dân đã đăng kí cư dân online rồi",
		})
		return
	}

	const salt = await bcrypt.genSalt(10)
	const pwd = await bcrypt.hash(password, salt)

	identity.citizen.pwd = pwd
	await GiamsatDataSource.getRepository(Citizen).save(identity.citizen)

	res.redirect("/citizen/register")
}

// dashboard page
export async function dashboardPage(req: Request, res: Response) {
	if (!res.locals.isAuthenticated) {
		return res.redirect("/citizen")
	}
	const citizenId = res.locals.citizen_id
	const citizen = await CuDanDataSource.getRepository(Citizen).findOne({
		where: {
			id: citizenId,
		},
		relations: {
			identity: true,
			passport: true,
			passport_registration_attempts: true,
		},
	})
	renderView(res, "citizen/dashboard", {
		citizen,
		identity: citizen?.identity,
		passport: citizen?.passport,
		attempts: citizen?.passport_registration_attempts,
	})
}

// logout
export function logout(req: Request, res: Response) {
	res.clearCookie("token")
	res.redirect("/citizen")
}

// trang dang ki cap ho chieu
export async function passportPage(req: Request, res: Response) {
	renderView(res, "passport/register_passport", {
		err: "",
	})
}

export async function apiRegisterPassport(req: Request, res: Response) {
	if (!res.locals.isAuthenticated) {
		return res.redirect("/citizen")
	}
	const {
		family_name,
		given_name,
		phone_number,
		identity_id,
		district_residence,
		city_residence,
		province_residence,
		email,
	} = req.body

	const identity = await CuDanDataSource.getRepository(CitizenIdentity)
		.findOne({
			where: {
				id: identity_id,
			},
			relations: {
				citizen: true,
			},
		})
		.catch(() => null)

	if (!identity || identity.citizen?.id !== res.locals.citizen_id) {
		renderView(res, "passport/register_passport", {
			err: "Cư dân không tồn tại",
		})
		return
	}

	await CuDanDataSource.getRepository(PassportRegistrationAttempt).save({
		id: randomUUID(),
		citizen_id: identity.citizen?.id,
		family_name,
		given_name,
		province_residence,
		city_residence,
		district_residence,
		identity_id,
	})
	res.redirect("/citizen/dashboard")
}
