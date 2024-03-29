import { Signal, effect, signal } from "@preact/signals-react";
import { getToken } from "../common/helper";
import { fetchGameInvitations, fetchInvitations,
  fetchMessageByRoom,
  fetchParticipants,
  fetchRooms,
  messageMaker,
  roomMaker,
  userMaker } from "./FetchChatData";

import authService from "../services/auth.service";
import roomService from "../services/chat/room.service";
import { ChatLink } from "../common/constants";
import { io } from "socket.io-client";

const currentRoom: Signal<number> = signal(-1);
const userLogged: Signal<boolean> = signal(false);
const chatError: Signal<{open: boolean, message: string}> = signal({open: false, message: ""});
const page: Signal<number> = signal(0);
const invitationIdList: Signal<{invitationId: string, roomName: string, roomId: string}[]> = signal([]);

const gameInvitationList: Signal<any[]> = signal([]);

const privilegedInRoom: {owner: Signal<boolean>, admin: Signal<boolean>} = {
  owner: signal(false),
  admin: signal(false)
};

type Message = {
  index: number,
  author: string,
  authorId: string,
  profileImage: string,
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
  roomType: number,
  roomName: Signal<string>,
  messages: Signal<Message[]>,
  userList: Signal<User[]>
  fetchStatus: boolean,
  creationDate: Date,
  isProtected: Signal<boolean | undefined>,
  isPrivate: Signal<boolean>
};

const chatData: Signal<Room[]> = signal([]);

const chatSocket = io(ChatLink, {
  auth: {
    token: getToken(),
  },
  withCredentials: true,
  autoConnect: false,
  
});

const insertMessage = (response: any) => {
  try {

    if (currentRoom.value > chatData.value.length)
      return;

    const room = chatData.value.find((room) => room.roomId === response.roomId);

    if (!room)
      return;

    if (room.fetchStatus === false)
      return;

    room.messages.value = [
      ...room.messages.value,
      messageMaker(
        response.author,
        response.authorId,
        response.messageId,
        response.message,
        response.messageTimestamp,
        response.profileImage
      )
    ]  
  } catch (error){
    console.error(error);
  }
  
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

const handleRoomCreation = (response: any) => {
  const room = roomMaker(
    response.roomId,
    response.roomName,
    response.creationDate,
    response.isPrivate,
    response.roomType,
    response.isProtected,
  );

  chatData.value = [
    ...chatData.value,
    room
  ]
}

const handleUserJoin = async (response: any) => {

  switch (response.userId === authService.getIdFromToken()) {
    case true:
      const roomData = await roomService.getRoomById(response.roomId);
      handleRoomCreation(roomData);
      break;
    default:
      const room: Room | undefined = chatData.value.find((room: any) => response.roomId === room.roomId);

      if (!room)
        return;

      room.userList.value = [
        ...room.userList.value,
        userMaker(
          false,
          false,
          response.userId,
          response.userName,
          response.profileImage
        ),
    
      ]
  }
}

const handleRemoveRoom = (response: any) => {
  currentRoom.value = -1;

  const index = chatData.value.findIndex((room) => room.roomId === response.roomId);
  chatData.value = chatData.value.filter((room) => room.roomId !== response.roomId);

  if (chatData.value.length > 0) {
    for (let k: number = index; k < chatData.value.length; k++) {
      chatData.value[k].index = k;
    }
  }
}

const handleRemoveUser = (response: any) => {

  switch (response.userId === authService.getIdFromToken()) {
    case true:
      handleRemoveRoom(response);
      break;

    default:
      const room : Room | undefined = chatData.value.find((room) => room.roomId === response.roomId );

      if (!room)
        return ;

      room.userList.value = room.userList.value.filter((user) => user.userId !== response.userId);
  }
}

const updatePrivateStatus = (response: any) => {
  const room = chatData.value.find((room) => room.roomId === response.roomId);

  if (!room)
    return;

  room.isPrivate.value = response.isPrivate;
  
}

const addInvitationToList = (response: any) => {

  invitationIdList.value = [
    ...invitationIdList.value,
    {
      invitationId: response.data.invitationId,
      roomId: response.data.roomId,
      roomName: response.data.roomName
    }
  ]
}

const updateProtectionStatus = (response: any) => {
  const room = chatData.value.find((room) => room.roomId === response.roomId);

  if (!room)
    return;
  
  room.isProtected.value = response.isProtected;
}

const filterOutEveryRequest = (response: any) => {

  if (invitationIdList.value.length < 0)
    return;

  invitationIdList.value = invitationIdList.value.filter(
    (invite) => (response.data !== invite.roomId)
  );
}

const addGameInvitation = (response: any) => {

  response.id = gameInvitationList.value.length;

  gameInvitationList.value = [
    ...gameInvitationList.value,
    response
  ];
}

const removeGameInvitation = (response: any) => {

  gameInvitationList.value = gameInvitationList.value.filter(
    (inv) => (inv.invitationId !== response.inviteId)
  );
}

// Effect knows what event is triggered base on the signal
effect(
  () => {

    switch (userLogged.value) {
      case true:
        chatSocket.connect();
        fetchRooms();
        fetchInvitations();
        fetchGameInvitations();

        //Keep the listeners alone!!!
        chatSocket.on('message-response', insertMessage);

        chatSocket.on('created', handleRoomCreation);
        chatSocket.on('joined', handleUserJoin);
        chatSocket.on('left', handleRemoveUser);
        chatSocket.on('chat-deleted', handleRemoveRoom);

        chatSocket.on('admin-toggle', adminUpdate);
        chatSocket.on('private-toggle', updatePrivateStatus);
        chatSocket.on('password-update', updateProtectionStatus);

        chatSocket.on('invitation-send', addInvitationToList);
        chatSocket.on('invitation-used', filterOutEveryRequest);

        chatSocket.on('game-invitation', addGameInvitation);
        chatSocket.on('cancel-game-invitation', removeGameInvitation);
        break;

      default:
        chatSocket.disconnect();
        currentRoom.value = -1;
    }
  }
);

effect(
  async () => {
    if (currentRoom.value > -1 &&
        chatData.value[currentRoom.value].fetchStatus === false
    ) {

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
      chatData.value[currentRoom.value].fetchStatus = true;
    }
  }
);

export type {
  Message,
  Room,
  User,
};

export {
  chatData,
  chatSocket,
  chatError,

  invitationIdList,

  gameInvitationList,

  privilegedInRoom,
  currentRoom,

  userLogged,
};
