import { DataSource } from "typeorm"
import { Passport } from "@/entities/passport.entity"

export default class PassportRepository {
	constructor(private dataSource: DataSource) {}

	async getCitizenPassports(citizenId: string) {
		return this.dataSource
			.getRepository(Passport)
			.createQueryBuilder("passport")
			.where("passport.citizen_id = :citizenId", { citizenId })
			.orderBy("passport.issue_date", "DESC")
			.getMany()
	}
	async create(passport: Partial<Passport>) {
        return this.dataSource.getRepository(Passport).save(passport);
    }
}
