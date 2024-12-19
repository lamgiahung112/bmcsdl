import { getDataSource, GiamsatDataSource } from "@/db"
import { sendEmail } from "@/lib/mail"
import PassportRepository from "@/repositories/passport.repository"
import PassportRegistrationAttemptRepository from "@/repositories/passport_registration_attempt.repository"
import { renderView } from "@/views"
import { randomUUID } from "crypto"
import { Request, Response } from "express"

export function registerPassportPage(req: Request, res: Response) {
	renderView(res, "passport/register_passport", null)
}

export async function registerPassport(req: Request, res: Response) {
	const passportRegistrationAttemptRepository =
		new PassportRegistrationAttemptRepository(GiamsatDataSource)
	const attempt = await passportRegistrationAttemptRepository.create({
		id: randomUUID(),
		family_name: req.body.family_name,
		given_name: req.body.given_name,
		// phone_number: req.body.phone_number,
		identity_id: req.body.identity_id,
		city_residence: req.body.city_residence,
		district_residence: req.body.district_residence,
		province_residence: req.body.province_residence,
		// email: req.body.email,
	})
	res.send(JSON.stringify(attempt))
}

///tạo passport
export const createPassportFromObject = async (passportData: {
	id: string
	citizen_id: string
	citizen_identity_id: string
	issue_date: string | Date
	expire_date: string | Date
	phone_number: string
}) => {
	try {
		// Lấy DataSource từ kết nối hiện tại
		// const dataSource = getDataSource();
		const passportRepository = new PassportRepository(GiamsatDataSource)

		// Validate dữ liệu đầu vào
		const {
			id,
			citizen_id,
			citizen_identity_id,
			issue_date,
			expire_date,
			phone_number,
		} = passportData

		if (
			!id ||
			!citizen_id ||
			!citizen_identity_id ||
			!issue_date ||
			!expire_date ||
			!phone_number
		) {
			throw new Error("Missing required fields")
		}

		// Tạo passport mới
		const newPassport = await passportRepository.create({
			id,
			// citizen_id,
			// citizen_identity_id,
			issue_date: new Date(issue_date),
			expire_date: new Date(expire_date),
			// phone_number,
		})

		// Trả về kết quả
		return {
			success: true,
			message: "Passport created successfully",
			data: newPassport,
		}
	} catch (error) {
		console.error("Error creating passport:", error)
		return {
			success: false,
			message: "Error creating passport",
			error: error,
		}
	}
}
