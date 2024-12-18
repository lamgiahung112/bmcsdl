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
