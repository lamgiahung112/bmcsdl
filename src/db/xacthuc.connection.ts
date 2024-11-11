import oracledb from "oracledb"

const dbConfig = {
	user: "xt",
	password: "xt",
	connectString: "localhost:1521/xepdb1",
}

export async function getXacthucConnection() {
	return oracledb.getConnection(dbConfig)
}

export async function initializeXacthucConnectionPool() {
	await oracledb.createPool({
        ...dbConfig,
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 2,
    })
}
