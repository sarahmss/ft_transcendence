import { Player } from "./player.model";

export class Room {
    public name: string;
    public players: Player[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }
}

