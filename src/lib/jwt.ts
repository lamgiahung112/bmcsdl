import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d"

export interface JWTPayload {
	role: string
	[key: string]: any // Allow for additional custom fields
}

/**
 * Generate a JWT token
 * @param payload Data to be encoded in the token
 * @returns JWT token string
 */
export const signToken = (payload: JWTPayload): string => {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	})
}

/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token: string): JWTPayload | null => {
	try {
		return jwt.verify(token, JWT_SECRET) as JWTPayload
	} catch (error) {
		return null
	}
}

/**
 * Decode a JWT token without verification
 * @param token JWT token to decode
 * @returns Decoded payload or null if invalid format
 */
export const decodeToken = (token: string): JWTPayload | null => {
	try {
		return jwt.decode(token) as JWTPayload
	} catch (error) {
		return null
	}
}
