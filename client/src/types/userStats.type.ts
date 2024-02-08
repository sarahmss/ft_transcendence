import MatchHistory from "./matchHistory.type"

export default interface IUserStats {
	userName?: string | null,
	email?: string,
	level?: string,
	gamesWonToLevelUp?: string,
	totalGamesWon?: number,
	totalGamesLost?: number,
	victories?: MatchHistory[],
	defeats?: MatchHistory[],
	matches?: number
}
