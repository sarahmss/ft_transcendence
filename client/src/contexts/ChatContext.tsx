
import socketClient from 'socket.io-client';
import { ChatLink } from '../common/constants';
import { Signal, effect, signal } from "@preact/signals-react";

type Message = {
  messageId: string,
  author: string,
  date: Date,
  messageContent: Signal<string>,
};

type Room = {
  roomId: string,
  roomName: Signal<string>,
  messages: Message[],
};

type User = {
  userId: string,
  userName: string,
}

type Chat = {
  rooms: Signal<Room[]>,
  participants: Signal<User[]>,
}

const chat: Signal<Chat> = signal({
  rooms: signal([]),
  participants: signal([]),
});

const chatSocket = socketClient(ChatLink, {
  autoConnect: true,
  transports: ['websocket'],
  withCredentials: true,
});

type test = {
  id: number,
  text: Signal<string>,
  sender: string
}

const messages: Signal<test[]> = signal([
	{ id: 1, text: signal("Hi there!"), sender: "bot" },
	{ id: 2, text: signal("Hello!"), sender: "user" },
	{ id: 3, text: signal("How can I assist you today?"), sender: "bot" },
]);

let id = 4;
const setMessage = (response: any) => {
  	messages.value = [
      ...messages.value,
      {
        id: id++,
        text: signal(response.message),
        sender: response.author
      }
    ];
}

chatSocket.on('message-response', setMessage);

export {
  chat,
  chatSocket,
  messages
};
