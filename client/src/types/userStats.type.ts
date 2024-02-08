import MatchHistory from "./matchHistory.type"

export default interface IUserStats {
	userName?: string | null,
	email?: string,
	level?: string,
	gamesWonToLevelUp?: string,
	totalGamesWon?: string,
	totalGamesLost?: string,
	victories?: MatchHistory[],
	defeats?: MatchHistory[],
	matches?: string
}
