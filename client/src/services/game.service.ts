import axios from "axios";
import { BackLink } from "../common/constants";
import authService from "./auth.service";


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
        `${BackLink}/game/invite`,
        packaged,
        { headers: authService.getAuthToken() }
      );
      return req.data;
    } catch (error) {
      
    }
  }
}

const gameService = new GameService();

export default gameService;
