import  IUser  from './user.type'; // Certifique-se de que o caminho está correto

export default interface MatchHistory {
    gameId: string;
    winnerId: string;
    loserId: string;
    winnerScore: number;
    loserScore: number;
    gameTime: number;
}