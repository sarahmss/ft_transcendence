import axios, { AxiosError } from "axios";
import { BackLink } from "../common/constants";
import authService from "./auth.service";
import { chatError } from "../contexts/ChatContext";


class GameService {

  async sendInvitation (
    hostId: string,
    targetId: string,
  ) {
    try {

      const packaged = {
        requestorId: hostId,
        secondPlayerId: targetId
      }
      
      const req = await axios.post(
        `${BackLink}/invitation/invite`,
        packaged,
        { headers: authService.getAuthToken() }
      );
      return req.data;
    } catch (error: any) {
      chatError.value = {
        open: true,
        message: error.response.data.message
      }
    }
  }

  async getInvitationList(userId: string) {
    
    try {
      const data = await axios.get(`${BackLink}/invitation/${userId}`,
                                  {headers: authService.getAuthToken()});
      if (!data)
        throw new AxiosError();
      return data.data;
    } catch (error: any) {
      chatError.value = {
        open: true,
        message: "Error at fetching invitation data"
      }
    }
  }

  async useInvite(
    invitedId: string,
    inviteId: string
  ) {
    try {

      const packaged = {
        invitedId: invitedId,
        inviteId: inviteId,
      }

      await axios.post(
        `${BackLink}/invitation/useGameInvite`,
        packaged,
        {headers: authService.getAuthToken()}
      );

      return true;
      
    } catch (error: any) {
      chatError.value = {
        open: true,
        message: error.response.data.message,
      }
      return false;
    }
    
  }
}

const gameService = new GameService();

export default gameService;
