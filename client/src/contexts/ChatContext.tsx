
import { io } from "socket.io-client"
import { ChatLink } from '../common/constants';
import { Signal, effect, signal } from "@preact/signals-react";
import { getToken } from "../common/helper";
import { fetchMessageByRoom, fetchParticipants, fetchRooms, messageMaker } from "./FetchChatData";
import authService from "../services/auth.service";

const currentRoom: Signal<number> = signal(-1);
const userLogged: Signal<boolean> = signal(false);
const page: Signal<number> = signal(0);
const privilegedInRoom: {owner: Signal<boolean>, admin: Signal<boolean>} = {
  owner: signal(false),
  admin: signal(false)
};

type Message = {
  index: number,
  author: string,
  authorId: string,
  messageId: string,
  message: Signal<string>,
  messageTimestamp: Date,
};

type User = {
  index: number,
  admin: Signal<boolean>,
  owner: boolean,
  userId: string,
  userName: Signal<string>,
  profileImage: Signal<string>,
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

const adminUpdate = (response: any) => {
  const room = chatData.value.find(data => data.roomId === response.roomId);
  if (!room)
    return;

  const userAdminStatus = room.userList.value.find(data => data.userId === response.userId);
  if (userAdminStatus)
    userAdminStatus.admin.value = response.admin;

  if (authService.getIdFromToken() === response.userId)
    privilegedInRoom.admin.value = response.admin;
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
chatSocket.on('admin-toggle', adminUpdate);
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

      const currentUser = await fetchParticipants(
        currentRoom.value,
        chatData.value[currentRoom.value].roomId
      );

      privilegedInRoom.admin.value = currentUser.admin;
      privilegedInRoom.owner.value = currentUser.owner;
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
  privilegedInRoom,
  currentRoom,
  userLogged,
};
