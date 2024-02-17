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
      console.log(error);
      throw error;
    }
  }

  async useInvite (
    userId: string,
    inviteId: string
  ) {
    try {
      const packaged = {
        userId: userId,
        inviteId: inviteId
      }
      return await axios.patch(BackLink + "/invite", packaged, {headers: authService.getAuthToken()});

    } catch (error) {
      console.log(error);
      throw error;

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
      console.log(error);
    }
  }
  
}

const inviteService = new InviteService();

export default inviteService;
