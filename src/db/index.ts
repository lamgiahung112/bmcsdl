import { Citizen } from "@/entities/citizen.entity"
import { CitizenIdentity } from "@/entities/citizen_identity.entity"
import { Passport } from "@/entities/passport.entity"
import { PassportRegistrationAttempt } from "@/entities/passport_registration_attempt.entity"
import { DataSource } from "typeorm"

export const GiamsatDataSource = new DataSource({
	type: "oracle",
	username: "gs",
	password: "gs",
	connectString: "localhost:1521/xepdb1",
	entities: [Citizen, CitizenIdentity, Passport, PassportRegistrationAttempt],
	synchronize: false,
	logging: true,
})

export const LuuTruDataSource = new DataSource({
	type: "oracle",
	username: "lt",
	password: "lt",
	connectString: "localhost:1521/xepdb1",
	entities: [Citizen, CitizenIdentity, Passport, PassportRegistrationAttempt],
	synchronize: false,
	logging: true,
})

export const XetDuyetDataSource = new DataSource({
	type: "oracle",
	username: "xd",
	password: "xd",
	connectString: "localhost:1521/xepdb1",
	entities: [Citizen, CitizenIdentity, Passport, PassportRegistrationAttempt],
	synchronize: false,
	logging: true,
})

export const XacThucDataSource = new DataSource({
	type: "oracle",
	username: "xt",
	password: "xt",
	connectString: "localhost:1521/xepdb1",
	entities: [Citizen, CitizenIdentity, Passport, PassportRegistrationAttempt],
	synchronize: false,
	logging: true,
})

export function getDataSource(role: string) {
	switch (role) {
		case "gs":
			return GiamsatDataSource
		case "lt":
			return LuuTruDataSource
		case "xd":
			return XetDuyetDataSource
		case "xt":
			return XacThucDataSource
	}
}

