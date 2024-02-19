import axios from "axios";
import { BackLink } from "../../common/constants";
import authService from "../auth.service";

class InviteService {

  async createInvite(
    requestorId: string,
    roomId: string,
    userId: string
  ) {
    try {
      
      const packaged = {
        requestorId: requestorId,
        roomId: roomId,
        userId: userId
      }
      await axios.post(BackLink + "/invite", packaged, {headers: authService.getAuthToken()});

    } catch (error) {
    }
  }

  async useInvite (
    userId: string,
    inviteId: string,
    status: boolean
  ) {
    try {
      const packaged = {
        userId: userId,
        inviteId: inviteId,
        response: status,
      }
      return await axios.patch(BackLink + "/invite", packaged, {headers: authService.getAuthToken()});

    } catch (error) {
    }
    
  }

  async getInvitation (
    userId: string
  ) {
    try {

      const res = await axios.post(
        `${BackLink}/invite/getInvitation`,
        {userId: userId},
        {headers: authService.getAuthToken()}
      );
      return res.data;
      
    } catch (error) {
    }
  }
  
}

const inviteService = new InviteService();

export default inviteService;
