export class JellyfinCredentials {
	username: string
	password?: string | undefined
	accessToken?: string | undefined

	constructor(username: string, password?: string | undefined, accessToken?: string | undefined) {
		this.username = username
		this.password = password
		this.accessToken = accessToken
	}
}
