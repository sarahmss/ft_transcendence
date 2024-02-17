export default  interface IUser {
	userId?: any | null,
	userName?: string | null,
	email?: string,
	password?: string,
	profilePicture?: string,
	hasTwoFactorAuth?: boolean
}
