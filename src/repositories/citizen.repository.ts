import { Citizen } from "@/entities/citizen.entity"
import { DataSource } from "typeorm"

export default class CitizenRepository {
	constructor(private dataSource: DataSource) {}

	async findOne(id: string) {
		return this.dataSource.getRepository(Citizen).findOneBy({
			id,
		})
	}
}
