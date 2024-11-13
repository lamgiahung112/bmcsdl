import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Citizen } from "./citizen.entity"
import { Passport } from "./passport.entity"

@Entity({ name: "CITIZENIDENTITY", schema: "GS" })
export class CitizenIdentity {
	@PrimaryColumn("varchar2", { length: 50, name: "ID" })
	id: string | undefined

	@Column("varchar2", { length: 50, name: "CITIZEN_ID" })
	citizen_id: string | undefined

	@Column("date", { name: "ISSUE_DATE" })
	issue_date: Date | undefined

	@Column("date", { name: "EXPIRE_DATE" })
	expire_date: Date | undefined

	@Column("varchar2", { length: 5, name: "IDENTITY_TYPE" })
	identity_type: "CMND" | "CCCD" | undefined

	@Column("varchar2", { length: 100, name: "DISTRICT_RESIDENCE" })
	district_residence: string | undefined

	@Column("varchar2", { length: 100, name: "CITY_RESIDENCE" })
	city_residence: string | undefined

	@Column("varchar2", { length: 100, name: "PROVINCE_RESIDENCE" })
	province_residence: string | undefined

	@ManyToOne(() => Citizen, (citizen) => citizen.identities)
	@JoinColumn({ name: "CITIZEN_ID" })
	citizen: Citizen | undefined

	@OneToMany(() => Passport, (passport) => passport.citizenIdentity)
	passports: Passport | undefined
}
