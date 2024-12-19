import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { Citizen } from "./citizen.entity"

@Entity({ name: "PASSPORTREGISTRATIONATTEMPTS", schema: "GS" })
export class PassportRegistrationAttempt {
	@PrimaryColumn("varchar2", { length: 50, name: "ID" })
	id: string | undefined

	@Column("varchar2", { length: 50, name: "CITIZEN_ID" })
	citizen_id: string | undefined

	@Column("varchar2", { length: 100, name: "FAMILY_NAME" })
	family_name: string | undefined

	@Column("varchar2", { length: 100, name: "GIVEN_NAME" })
	given_name: string | undefined

	@Column("varchar2", { length: 100, name: "DISTRICT_RESIDENCE" })
	district_residence: string | undefined

	@Column("varchar2", { length: 100, name: "CITY_RESIDENCE" })
	city_residence: string | undefined

	@Column("varchar2", { length: 100, name: "PROVINCE_RESIDENCE" })
	province_residence: string | undefined

	@Column("varchar2", { length: 50, name: "IDENTITY_ID" })
	identity_id: string | undefined

	@Column("date", { name: "CREATED_AT", default: () => "SYSDATE" })
	created_at: Date | undefined

	@Column("date", { name: "ACCEPTED_AT", nullable: true })
	accepted_at: Date | undefined

	@Column("date", { name: "VERIFIED_AT", nullable: true })
	verified_at: Date | undefined

	@Column("date", { name: "REJECTED_AT", nullable: true })
	rejected_at: Date | undefined

	@Column("varchar2", { length: 1000, name: "REJECTED_REASON", nullable: true })
	rejected_reason: string | undefined

	@ManyToOne(() => Citizen)
	@JoinColumn({ name: "CITIZEN_ID" })
	citizen: Citizen | undefined
}
