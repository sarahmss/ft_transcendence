
import { Signal, signal } from "@preact/signals-react";

type Message = {
  messageContent: string,
};

type Room = {
  roomId: string,
  messages: Message[],
};

type User = {
  userId: string,
}

type Chat = {
  rooms: Room[],
  participants: User[],
}

const Chat: Signal<Chat> = signal({
  rooms: [],
  participants: [],
});
