import oracledb from "oracledb"

const dbConfig = {
	user: "lt",
	password: "lt",
	connectString: "localhost:1521/xepdb1",
}

export async function getLuutruConnection() {
	return oracledb.getConnection(dbConfig)
}

export async function initializeLuutruConnectionPool() {
	await oracledb.createPool({
		...dbConfig,
		poolMin: 2,
		poolMax: 10,
		poolIncrement: 2,
	})
}
