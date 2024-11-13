import { CitizenIdentity } from "@/entities/citizen_identity.entity"
import { DataSource } from "typeorm"

export default class CitizenIdentityRepository {
	constructor(private dataSource: DataSource) {}

	async findOne(id: string) {
		return this.dataSource
			.getRepository(CitizenIdentity)
			.createQueryBuilder("citizen_identity")
			.leftJoinAndSelect("citizen_identity.citizen", "citizen")
			.where("citizen_identity.id = :id", { id })
			.getOne()
	}
}
