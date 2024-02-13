import authService from "../services/auth.service";
import messageService from "../services/chat/message.service";
import roomService from "../services/chat/room.service";
import { Message, Room, User, chatData } from "./ChatContext";
import { signal } from "@preact/signals-react";

const addRoom = (room: Room) => {

  chatData.value = [
    ...chatData.value,
    room
  ];
}

const addMessage = (room: Room, message: Message) => {

  room.messages.value = [
    ...room.messages.value,
    message
  ]
};

const addUser = (room: Room, user: User) => {
  room.userList.value = [
    ...room.userList.value,
    user
  ];
  
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
  isProtected?: boolean,
) : Room => {
  return (
    {
      index: chatData.value.length,
      roomId: roomId,
      roomName: signal(roomName),
      creationDate: creationDate,
      isProtected: isProtected,
      messages: signal([]),
      userList: signal([]),
    }
  );
}

const messageMaker = (
  author: string,
  authorId: string,
  messageId: string,
  message: string,
  messageTimestamp: Date
): Message => {
  return {
    author: author,
    authorId: authorId,
    messageId: messageId,
    message: signal(message),
    messageTimestamp: messageTimestamp,
  }
};

const fetchRooms = async () => {
  const roomRaw: any[] = await roomService.getRoom(authService.getIdFromToken());

  roomRaw.forEach((room) => {

    addRoom(
      roomMaker(
      room.roomId,
      room.roomName,
      room.creationDate,
      room.isProtected,
    ));

  });
}

const fetchMessageByRoom = async (index: number, roomId: string, pageNumber: number) => {

  const messageRaw: any[] = await messageService.getMessage(
    authService.getIdFromToken(),
    roomId,
    pageNumber,
    50
  );

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
      )
    )
  }
}

const fetchParticipants = async (index: number, roomId: string) => {
  const participants: any[] = await roomService.getParticipants(roomId);

  if (!participants || participants.length === 0)
    return ;

  const room = chatData.value[index];

  participants.forEach((user: User) => {
    addUser(room, user);
  });
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

export {
  messageMaker,
  roomMaker,
  fetchMessageByRoom,
  fetchParticipants,
  fetchRooms
};
