import authService from "../services/auth.service";
import inviteService from "../services/chat/invite.service";
import messageService from "../services/chat/message.service";
import roomService from "../services/chat/room.service";
import gameService from "../services/game.service";
import { Message, Room, User, chatData, gameInvitationList, invitationIdList } from "./ChatContext";
import { signal } from "@preact/signals-react";

const addRoom = (room: Room) => {

  chatData.value = [
    ...chatData.value,
    room
  ];
}

const addMessage = (room: Room, message: Message) => {

  message.index = room.messages.value.length;
  room.messages.value = [
    ...room.messages.value,
    message
  ]
};

const addUser = (room: Room, user: User) => {

  user.index = room.userList.value.length;
  room.userList.value = [
    ...room.userList.value,
    user
  ];
  
}

const addInvitation = (inviteId: any) => {
  invitationIdList.value = [
    ...invitationIdList.value,
    inviteId
  ]
}

const updateMessageContent = (messageId: string, roomId: string, newMessage: string) => {

  const room: Room | undefined = findRoom(roomId);
  if (!room)
    return ;

  const message: Message | undefined = findMessage(room, messageId);
  if (!message)
    return ;

  message.message.value = newMessage;
};

const updateRoomName = (roomId: string, newRoomName: string) => {
  const room: Room | undefined = findRoom(roomId);
  if (!room)
    return ;

  room.roomName.value = newRoomName;
}

const roomMaker = (
  roomId: string,
  roomName: string,
  creationDate: Date,
  isPrivate: boolean,
  roomType: number,
  isProtected?: boolean,
) : Room => {
  return (
    {
      index: chatData.value.length,
      roomId: roomId,
      roomName: signal(roomName),
      creationDate: creationDate,
      isProtected: signal(isProtected),
      messages: signal([]),
      userList: signal([]),
      fetchStatus: false,
      isPrivate: signal(isPrivate),
      roomType: roomType,
    }
  );
}

const messageMaker = (
  author: string,
  authorId: string,
  messageId: string,
  message: string,
  messageTimestamp: Date,
  profileImage: string
): Message => {
  return {
    index: -1,
    author: author,
    authorId: authorId,
    messageId: messageId,
    profileImage: profileImage,
    message: signal(message),
    messageTimestamp: messageTimestamp,
  }
};

const userMaker = (
  admin: boolean,
  owner: boolean,
  userId: string,
  userName: string,
  profileImage: string
): User => {

  return ({
    index: -1,
    admin: signal(admin),
    owner: owner,
    userId: userId,
    userName: signal(userName),
    profileImage: signal(profileImage),
  });
  
}

const fetchRooms = async () => {
  if (authService.getIsLogged()){
    const roomRaw: any[] = await roomService.getRoom(authService.getIdFromToken());

    if (!roomRaw) {
      console.log('Failure fetching rooms');
      return ;
    }

    roomRaw.forEach((room) => {

      addRoom(
        roomMaker(
          room.roomId,
          room.roomName,
          room.creationDate,
          room.isPrivate,
          room.roomType,
          room.isProtected,
      ));

    });    
  }

}

const fetchMessageByRoom = async (index: number, roomId: string, pageNumber: number) => {

  const messageRaw: any[] = await messageService.getMessage(
    authService.getIdFromToken(),
    roomId,
    -1,
    -1
  );

  if (!messageRaw) {
    console.log("Failure fetching rooms");
    return ;
  }

  if (messageRaw.length <= 0)
    return ;

  const room = chatData.value[index];

  if (!room)
    return ;

  for (let i = messageRaw.length - 1; i > -1; i--) {
    const message = messageRaw[i];
    addMessage(
      room,
      messageMaker(
        message.author,
        message.authorId,
        message.messageId,
        message.message,
        message.messageTimestamp,
        message.profileImage
      )
    )
  }
}

const fetchParticipants = async (index: number, roomId: string) => {
  try {
    const participants: any[] = await roomService.getParticipants(roomId);
    const currentMember: any = await roomService.getCurrentUser(roomId);

    if (!participants) {
      console.log("Failure fetching participants");
      return ;
    }

    if (participants.length === 0) 
      return ;

    const room = chatData.value[index];

    participants.forEach((user: any) => {
      addUser(room, userMaker(
        user.admin,
        user.owner,
        user.userId,
        user.userName,
        user.profileImage
      ));
    });

    return currentMember;    
  } catch(error) {
    console.error(error);
  }

}

const findRoom = (roomId: string) => {
  return chatData.value.find(
    (room: Room) =>
    room.roomId === roomId
  );
}

const findMessage = (room: Room, messageId : string) => {
  return room.messages.value.find(
    (message: Message) => 
      message.messageId === messageId
  );
}

const fetchInvitations = async () => {

  const invites: any[] = await inviteService.getInvitation(authService.getIdFromToken());

  if (!invites) {
    console.log("Failure fetching participants");
    return;
  }

  invites.forEach( (inv) => {
    addInvitation(inv);
  })     
}

const fetchGameInvitations = async () => {
  const gameInvites: any[] = await gameService.getInvitationList(authService.getIdFromToken());

  if (!gameInvites)
    return;

  gameInvitationList.value = gameInvites;
}

export {
  messageMaker,
  roomMaker,
  userMaker,
  fetchMessageByRoom,
  fetchParticipants,
  fetchInvitations,
  fetchGameInvitations,
  fetchRooms
};
