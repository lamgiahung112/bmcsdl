import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity({ name: "PASSPORTREGISTRATIONATTEMPTS", schema: "GS" })
export class PassportRegistrationAttempt {
	@PrimaryColumn("varchar2", { length: 50, name: "ID" })
	id: string | undefined

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

	@Column("varchar2", { length: 20, name: "PHONE_NUMBER" })
	phone_number: string | undefined

	@Column("varchar2", { length: 100, name: "EMAIL" })
	email: string | undefined

	@Column("varchar2", { length: 50, name: "IDENTITY_ID" })
	identity_id: string | undefined

	@Column("date", { name: "CREATED_AT" })
	created_at: Date | undefined

	@Column("date", { name: "ACCEPTED_AT" })
	accepted_at: Date | undefined

	@Column("date", { name: "VERIFIED_AT" })
	verified_at: Date | undefined

	@Column("date", { name: "REJECTED_AT" })
	rejected_at: Date | undefined

	@Column("varchar2", { length: 1000, name: "REJECTED_REASON" })
	rejected_reason: string | undefined
}
