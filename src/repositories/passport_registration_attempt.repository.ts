import { PassportRegistrationAttempt } from "@/entities/passport_registration_attempt.entity"
import { DataSource, FindOperator, ILike, IsNull, Not } from "typeorm"

interface PaginationOptions {
	page: number
	perPage: number
	filters: {
		status?: string // task delete status all UI
		name?: string
	}
}
			
//create UI for LUUTRU (show list PassportRegistrationAttempt(click item-> show detail item-> button create passport)  )
class PassportRegistrationAttemptRepository {
	constructor(private dataSource: DataSource) {}

	async paginate(options: PaginationOptions) {
		const { page, perPage, filters } = options

		const query = this.dataSource.createQueryBuilder(
			PassportRegistrationAttempt,
			"attempt"
		)
		const where: Record<string, string | Date | FindOperator<any> | undefined> = {}

		if (filters.status === "accepted") where.accepted_at = Not(IsNull())
		if (filters.status === "verified") where.verified_at = Not(IsNull())
		if (filters.status === "rejected") where.rejected_at = Not(IsNull())
		if (filters.status === "pending") {
			where.verified_at = IsNull()
			where.accepted_at = IsNull()
			where.rejected_at = IsNull()
		}
		if (filters.name) where.given_name = ILike(`%${filters.name}%`)

		const total = await query.where(where).getCount()
		const items = await query
			.where(where)
			.skip((page - 1) * perPage)
			.take(perPage)
			.orderBy("attempt.created_at", "DESC")
			.getMany()

		return {
			total,
			items,
		}
	}

	async create(attempt: Partial<PassportRegistrationAttempt>) {
		return this.dataSource.getRepository(PassportRegistrationAttempt).save(attempt)
	}

	async findOne(id: string) {
		return this.dataSource.getRepository(PassportRegistrationAttempt).findOneBy({
			id,
		})
	}

	async verify(id: string) {
		return this.dataSource.getRepository(PassportRegistrationAttempt).update(id, {
			verified_at: new Date(),
		})
	}

	async reject(id: string, reason: string) {
		return this.dataSource.getRepository(PassportRegistrationAttempt).update(id, {
			rejected_at: new Date(),
			rejected_reason: reason,
		})
	}

	async accept(id: string) {
		return this.dataSource.getRepository(PassportRegistrationAttempt).update(id, {
			accepted_at: new Date(),
		})
	}
}

export default PassportRegistrationAttemptRepository
