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
    }
  }

  async deleteRoom (
    roomId: string
  ) {
    try {
      await axios.delete(BackLink + `/room/${roomId}`, {headers: authService.getAuthToken()});

    } catch (error) {
      console.log(error);
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
      await axios.post(BackLink + "/room/leave", packaged, {headers: authService.getAuthToken()});

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
      axios.post(BackLink + "/room", packaged, {headers: authService.getAuthToken()});

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
      await axios.post(BackLink + "/room/join", packaged, {headers: authService.getAuthToken()});

    } catch (error) {
      
      console.log(error);
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

      await axios.patch(BackLink + "/room/set_pass", packaged, {headers: authService.getAuthToken()});
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
      await axios.patch(BackLink + "/room/unset_pass", packaged, {headers: authService.getAuthToken()});

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

      await axios.patch(BackLink + "/room/toggle_private", packaged, {headers: authService.getAuthToken()});
    } catch (error) {
      console.log(error);
    }
  }

  async getParticipants(
    roomId: string
  ) {
    try {
      const resp = await axios.get(BackLink + `/room/${roomId}`, {headers: authService.getAuthToken()});
      return resp.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrentUser(
    roomId: string
  ) {
    try {
      const userId = authService.getIdFromToken();

      return (await axios.get(
        `${BackLink}/room/curr/${roomId}/${userId}`,
        {headers: authService.getAuthToken()}
      )).data;

    } catch (error) {
      console.log(error);
    }
  }

  async kickUser(
    roomId: string,
    userId: string,
    requestorId: string,
  ) {
    try {

      const packaged = {
        roomId: roomId,
        userId: userId,
        requestorId: requestorId,
      }

      await axios.post(`${BackLink}/room/kick`, packaged,
        {headers: authService.getAuthToken()});
    } catch (error) {

      console.log(error);
    }
  }

  async getRoomById(rid: string) {
    try {
      const room = await axios.get(`${BackLink}/room/s/${rid}`, {headers: authService.getAuthToken()});
      return room.data;
    } catch (error) {
      console.log(error);
    }
    
  }
}

const roomService = new RoomService();

export default roomService;
