import axios from "axios";
import { BackLink } from "../../common/constants";
import authService from "../auth.service";

class RoomService {

  async getRoom (
    userId: string
  ) {
    try {

      const packaged = {
        userId: userId
      }
      const roomList  = await axios.post(BackLink + "/room/list_room",
                                      packaged,
                                      { headers: authService.getAuthToken() }
      );
      return roomList.data;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteRoom (
    roomId: string
  ) {
    try {
      await axios.delete(BackLink + `/room/${roomId}`);

    } catch (error) {
      console.log(error);
      throw error;

    }
  }

  async leaveRoom (
    userId: string,
    roomId: string
  ) {

    try {
      const packaged = {
        userId: userId,
        roomId: roomId
      }
      await axios.post(BackLink + "/room/leave", packaged);

    } catch (error) {
      console.log(error);
      throw error;

    }
  }

  async createRoom (
    roomType: number,
    userId: string[],
    ownerId: string,
    roomName: string,
    isPrivate: boolean,
    password: string
  ) {

    try {
      const packaged = {
        roomType: roomType,
        userId: userId,
        ownerId: ownerId,
        roomName: roomName,
        isPrivate: isPrivate,
        password: password
      }
      axios.post(BackLink + "/room", packaged);

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async joinRoom (
    roomId: string,
    userId: string,
    password: string
  ) {
    try {
      
      const packaged = {
        roomId: roomId,
        userId: userId,
        password: password,
      }
      await axios.post(BackLink + "/room/join", packaged);
    } catch (error) {
      
      console.log(error);
      throw error;
    }
  }

  async setPassword(
    userId: string,
    roomId: string,
    password: string,
  ) {
    try {
      const packaged = {
        userId: userId,
        roomId: roomId,
        password: password,
      }

      await axios.patch(BackLink + "/room/set_pass", packaged);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async unsetPassword(
    userId: string,
    roomId: string
  ) {
    try  {
      const packaged = {
        userId: userId,
        roomId: roomId,
      }
      await axios.patch(BackLink + "/room/unset_pass", packaged);

    } catch (error) {
      console.log(error);
      throw error;

    }
  }

  async togglePrivate(
    userId: string,
    roomId: string,
  ) {
    try {
      const packaged = {
        userId: userId,
        roomId: roomId,
      }

      await axios.patch(BackLink + "/room/toggle_private", packaged);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const roomService = new RoomService();

export default roomService;
