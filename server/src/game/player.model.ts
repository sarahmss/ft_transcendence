export class Player {
    public name: string;
    public room: string;

    constructor(name: string)
    {
        this.name = name;
        this.room = undefined;
    }

    setRoom(roomId: string) {
        this.room = roomId;
    }
}