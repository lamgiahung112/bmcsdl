import oracledb from "oracledb"

const dbConfig = {
	user: "gs",
	password: "gs",
	connectString: "localhost:1521/xepdb1",
}

export async function getGiamsatConnection() {
	return oracledb.getConnection(dbConfig)
}

export async function initializeGiamsatConnectionPool() {
	await oracledb.createPool({
		...dbConfig,
		poolMin: 2,
		poolMax: 10,
		poolIncrement: 2,
	})
}
