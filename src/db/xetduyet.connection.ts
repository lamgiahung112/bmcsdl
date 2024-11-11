import oracledb from "oracledb"

const dbConfig = {
	user: "xd",
	password: "xd",
	connectString: "localhost:1521/xepdb1",
}

export async function getXetduyetConnection() {
	return oracledb.getConnection(dbConfig)
}

export async function initializeXetduyetConnectionPool() {
	await oracledb.createPool({
		...dbConfig,
		poolMin: 2,
		poolMax: 10,
		poolIncrement: 2,
	})
}
