import axios from "axios";
import { BackLink } from "../../common/constants";

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
      const invite = await axios.post(BackLink + "/invite", packaged);
      return invite;

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
      return await axios.patch(BackLink + "/invite", packaged);

    } catch (error) {
      console.log(error);
      throw error;

    }
    
  }
  
}

const inviteService = new InviteService();

export default inviteService;
