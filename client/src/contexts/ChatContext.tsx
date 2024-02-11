
import { io } from "socket.io-client"
import { ChatLink } from '../common/constants';
import { Signal, effect, signal } from "@preact/signals-react";
import { getToken } from "../common/helper";

type Message = {
  author: string,
  authorId: string,
  messageId: string,
  message: Signal<string>,
  messageTimestamp: Date,
};

type User = {
  userId: string,
  userName: string,
  status: string,
  profileImage: string,
}

type Room = {
  roomId: string,
  roomName: Signal<string>,
  messages: Signal<Message[]>,
  userList: Signal<User[]>
  creationDate: Date,
  isProtected?: boolean,
};

const roomData: Signal<Room[]> = signal([]);

const chatSocket = io(ChatLink, {
  auth: {
    token: getToken(),
  },
  withCredentials: true
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

const makeMessage = (response: any) => {
  return {
    author: response.author,
    authorId: response.authorId,
    messageId: response.messageId,
    message: signal(response.message),
    messageTimestamp: response.messsageTimestamp,
  }
}

// Change to the real implementation later
// Test
let id = 4;
const insertMessage = (response: any) => {

  // Real implementation
  // const room = chatData.value.rooms.value.find(response.roomId);
  // if (!room)
  //   return;

  // room.messages.value = [
  //   ...room.messages.value,
  //   makeMessage(response)
  // ]

	messages.value = [
    ...messages.value,
    {
      id: id++,
      text: signal(response.message),
      sender: response.author
    }
  ];

  messages.value.forEach((msg) => {
    
    msg.text.value = "test";
  })
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

chatSocket.on('message-response', insertMessage);
// chatSocket.on('left', removeRoom);

const currentRoom: Signal<string> = signal("");
const userLogged: Signal<boolean> = signal(false);

// Signals knows what event is triggered base on the signal
effect(
  () => {
    if (userLogged.value === false)
      currentRoom.value = "";
  }
);

export {
  roomData,
  chatSocket,
  currentRoom,
  userLogged,
  messages
};
