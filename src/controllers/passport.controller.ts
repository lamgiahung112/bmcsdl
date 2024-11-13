import { GiamsatDataSource } from "@/db"
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
		phone_number: req.body.phone_number,
		identity_id: req.body.identity_id,
		city_residence: req.body.city_residence,
		district_residence: req.body.district_residence,
		province_residence: req.body.province_residence,
		email: req.body.email,
	})
	res.send(JSON.stringify(attempt))
}
