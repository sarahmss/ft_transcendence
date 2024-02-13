
import { io } from "socket.io-client"
import { ChatLink } from '../common/constants';
import { Signal, effect, signal } from "@preact/signals-react";
import { getToken } from "../common/helper";
import { fetchMessageByRoom, fetchParticipants, fetchRooms, messageMaker } from "./FetchChatData";
import roomService from "../services/chat/room.service";

const currentRoom: Signal<number> = signal(-1);
const userLogged: Signal<boolean> = signal(false);
const messageCurrent: Signal<any> = signal(null);
const page: Signal<number> = signal(0);

type Message = {
  author: string,
  authorId: string,
  messageId: string,
  message: Signal<string>,
  messageTimestamp: Date,
};

type User = {
  admin: boolean,
  owner: boolean,
  userId: string,
  userName: string,
  profileImage: string,
}

type Room = {
  index: number,
  roomId: string,
  roomName: Signal<string>,
  messages: Signal<Message[]>,
  userList: Signal<User[]>
  creationDate: Date,
  isProtected?: boolean,
};

const chatData: Signal<Room[]> = signal([]);

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


// Change to the real implementation later
// Test
const insertMessage = (response: any) => {

  if (currentRoom.value > chatData.value.length)
    return;

  const room = chatData.value[currentRoom.value];

  room.messages.value = [
    ...room.messages.value,
   messageMaker(
     response.author,
     response.authorId,
     response.messageId,
     response.message,
     response.messageTimestamp
   )
  ]
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
chatSocket.on('get-participants', () => {});
// chatSocket.on('left', removeRoom);

// Effect knows what event is triggered base on the signal
effect(
  () => {
    if (userLogged.value === false)
      currentRoom.value = -1;
  }
);

effect(
  async () => {
    if (currentRoom.value > -1) {

      fetchMessageByRoom(
        currentRoom.value,
        chatData.value[currentRoom.value].roomId,
        page.value
      );

      messageCurrent.value = chatData.value[currentRoom.value].messages;

      await fetchParticipants(
        currentRoom.value,
        chatData.value[currentRoom.value].roomId
      );
    }
  }
);

fetchRooms();

export type {
  Message,
  Room,
  User,
};

export {
  chatData,
  chatSocket,
  messageCurrent,
  currentRoom,
  userLogged,
  messages
};
