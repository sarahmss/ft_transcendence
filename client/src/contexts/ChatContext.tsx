
import { io } from "socket.io-client"
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

const chatSocket = io(ChatLink);

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

// Change to the real implementation later
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

// const removeRoom = (roomData: any) => {
//   chat.value.rooms.value = chat.value.rooms.value.filter((room: any) => {
//     room.roomId !== roomData.roomId
//   });
// }

// const joinRoom = (roomData: any) => {

//   chat.value.rooms.value = [
//     ...chat.value.rooms.value,
//     roomData.room
//   ]

//   chat.value.rooms.value = [
//     ...chat.value.participants.value,
//     roomData.user
//   ]
// }

chatSocket.on('message-response', setMessage);
// chatSocket.on('left', removeRoom);


export {
  chat,
  chatSocket,
  messages
};
