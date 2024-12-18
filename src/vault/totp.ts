import { createCanvas } from "canvas"

function getTotp(citizen_id: string) {
	const headers = new Headers()
	headers.append("X-Vault-Token", process.env.VAULT_TOKEN ?? "")

	return (
		fetch(`http://localhost:8200/v1/totp/code/${citizen_id}`, {
			headers,
		})
			.then((res) => res.json())
			/* @ts-ignore */
			.then((res) => res?.data?.code as string)
	)
}

function createTotpSecret(citizen_id: string, citizen_name: string) {
	const headers = new Headers()
	headers.append("X-Vault-Token", process.env.VAULT_TOKEN ?? "")

	const data = {
		generate: true,
		issuer: "VNEID",
		account_name: citizen_name,
	}
	return (
		fetch(`http://localhost:8200/v1/totp/keys/${citizen_id}`, {
			headers,
			method: "POST",
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			/* @ts-ignore */
			.then((res) => res?.data?.url as string)
	)
}

function getTotpSecretQrData(secret_url: string) {
	const canvas = createCanvas(400, 400)
	const context = canvas.getContext("2d")

	// Background
	context.fillStyle = "white"
	context.fillRect(0, 0, 400, 400)

	// Text style
	context.fillStyle = "black"
	context.font = "20px Arial"
	context.textAlign = "center"
	context.textBaseline = "middle"

	// Render text
	context.fillText(secret_url, 400 / 2, 400 / 2)

	// Return data URL
	return canvas.toDataURL()
}

export { createTotpSecret, getTotp, getTotpSecretQrData }
