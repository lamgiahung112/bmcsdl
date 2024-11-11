import {
	getXacthucConnection,
	initializeXacthucConnectionPool,
} from "./xacthuc.connection"
import {
	getGiamsatConnection,
	initializeGiamsatConnectionPool,
} from "./giamsat.connection"
import {
	getXetduyetConnection,
	initializeXetduyetConnectionPool,
} from "./xetduyet.connection"
import {
	getLuutruConnection,
	initializeLuutruConnectionPool,
} from "./luutru.connection"

export async function initializeConnectionPool() {
	await initializeXacthucConnectionPool()
	await initializeGiamsatConnectionPool()
	await initializeXetduyetConnectionPool()
	await initializeLuutruConnectionPool()
	console.log("Connection pool created successfully")
}

export function getConnectionFromRole(role: string) {
	if (role === "xt") {
		return getXacthucConnection()
	} else if (role === "gs") {
		return getGiamsatConnection()
	} else if (role === "xd") {
		return getXetduyetConnection()
	} else if (role === "lt") {
		return getLuutruConnection()
	}
	return null
}
