import { Entity, Column, PrimaryColumn, OneToMany, OneToOne } from "typeorm"
import { Citizen } from "./citizen.entity"

@Entity({ name: "CITIZENIDENTITY", schema: "GS" })
export class CitizenIdentity {
	@PrimaryColumn("varchar2", { length: 50, name: "ID" })
	id: string | undefined

	@Column("date", { name: "ISSUE_DATE", nullable: false })
	issue_date: Date | undefined

	@Column("date", { name: "EXPIRE_DATE", nullable: false })
	expire_date: Date | undefined

	@Column("varchar2", { length: 5, name: "IDENTITY_TYPE" })
	identity_type: "CMND" | "CCCD" | undefined

	@Column("varchar2", { length: 100, name: "DISTRICT_RESIDENCE", nullable: false })
	district_residence: string | undefined

	@Column("varchar2", { length: 100, name: "CITY_RESIDENCE", nullable: false })
	city_residence: string | undefined

	@Column("varchar2", { length: 100, name: "PROVINCE_RESIDENCE", nullable: false })
	province_residence: string | undefined

	@OneToOne(() => Citizen, (citizen) => citizen.identity)
	citizen: Citizen | undefined
}
