export default interface IUser {
	userId?: any | null,
	userName?: string | null,
	email?: string,
	password?: string,
	profilePicture?: string,
	hasTwoFactorAuth?: boolean
}

export default interface IUserStats {
	userName?: string | null,
	email?: string,
	level?: string,
	gamesWonToLevelUp?: string,
	totalGamesWon?: string,
	victories?: string,
	defeats?: string,
	matches?: string
}

export default interface ITwoFac {
	setState?: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>> | null,

}
