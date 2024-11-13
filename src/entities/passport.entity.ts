import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { Citizen } from "./citizen.entity"
import { CitizenIdentity } from "./citizen_identity.entity"

@Entity({ name: "PASSPORT", schema: "GS" })
export class Passport {
	@PrimaryColumn("varchar2", { length: 50, name: "ID" })
	id: string | undefined

	@Column("varchar2", { length: 50, name: "CITIZEN_ID" })
	citizen_id: string | undefined

	@Column("varchar2", { length: 50, name: "CITIZEN_IDENTITY_ID" })
	citizen_identity_id: string | undefined

	@Column("date", { name: "ISSUE_DATE" })
	issue_date: Date | undefined

	@Column("date", { name: "EXPIRE_DATE" })
	expire_date: Date | undefined

	@Column("varchar2", { length: 20, name: "PHONE_NUMBER" })
	phone_number: string | undefined

	@ManyToOne(() => Citizen, (citizen) => citizen.passports)
	@JoinColumn({ name: "CITIZEN_ID" })
	citizen: Citizen | undefined

	@ManyToOne(() => CitizenIdentity, (identity) => identity.passports)
	@JoinColumn({ name: "CITIZEN_IDENTITY_ID" })
	citizenIdentity: CitizenIdentity | undefined
}
