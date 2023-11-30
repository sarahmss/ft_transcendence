export default interface IUser {
	userId?: any | null,
	userName?: string | null,
	email?: string,
	password?: string,
	profilePicture?: string
}

export default interface ITwoFac {
	setState?: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>> | null,

}
