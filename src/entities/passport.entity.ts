import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { Citizen } from "./citizen.entity"

@Entity({ name: "PASSPORT", schema: "GS" })
export class Passport {
	@PrimaryColumn("varchar2", { length: 50, name: "ID" })
	id: string | undefined

	@Column("varchar2", { length: 50, name: "CITIZEN_ID", nullable: false })
	citizen_id: string | undefined

	@Column("varchar2", { length: 100, name: "DISTRICT_RESIDENCE", nullable: false })
	district_residence: string | undefined

	@Column("varchar2", { length: 100, name: "CITY_RESIDENCE", nullable: false })
	city_residence: string | undefined

	@Column("varchar2", { length: 100, name: "PROVINCE_RESIDENCE", nullable: false })
	province_residence: string | undefined

	@Column("date", { name: "ISSUE_DATE", nullable: false })
	issue_date: Date | undefined

	@Column("date", { name: "EXPIRE_DATE", nullable: false })
	expire_date: Date | undefined

	@OneToOne(() => Citizen)
	@JoinColumn({ name: "CITIZEN_ID" })
	citizen: Citizen | undefined
}
