import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { CitizenIdentity } from "./citizen_identity.entity"
import { Passport } from "./passport.entity"

@Entity({ name: "CITIZEN", schema: "GS" })
export class Citizen {
	@PrimaryColumn("varchar2", { length: 50, name: "ID" })
	id: string | undefined

	@Column("varchar2", { length: 100, name: "FAMILY_NAME" })
	family_name: string | undefined

	@Column("varchar2", { length: 100, name: "GIVEN_NAME" })
	given_name: string | undefined

	@Column("date", { name: "DOB" })
	dob: Date | undefined

	@Column("varchar2", { length: 10, name: "SEX" })
	sex: string | undefined

	@Column("varchar2", { length: 50, name: "ETHNICITY" })
	ethnicity: string | undefined

	@Column("varchar2", { length: 50, name: "RELIGION", nullable: true })
	religion: string | undefined

	@Column("varchar2", { length: 100, name: "DISTRICT_ORIGIN" })
	district_origin: string | undefined

	@Column("varchar2", { length: 100, name: "CITY_ORIGIN" })
	city_origin: string | undefined

	@Column("varchar2", { length: 100, name: "PROVINCE_ORIGIN" })
	province_origin: string | undefined

	@OneToMany(() => CitizenIdentity, (identity) => identity.citizen)
	identities: CitizenIdentity[] | undefined

	@OneToMany(() => Passport, (passport) => passport.citizen)
	passports: Passport[] | undefined
}
