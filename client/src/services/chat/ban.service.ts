
import axios from "axios";
import { BackLink } from "../../common/constants";
import authService from "../auth.service";
import { chatError } from "../../contexts/ChatContext";


class BanService {

  async banUser (
    userId: string,
    targetId: string,
    roomId: string,
    duration: number
  ) {

    try {
      const packaged = {
        userId: userId,
        targetId: targetId,
        roomId: roomId,
        duration: duration
      }

      return await axios.post(BackLink + "/ban", packaged, {headers: authService.getAuthToken()});
    } catch (error: any) {
      chatError.value = {
        open: true,
        message: error.response.data.message
      }
    }

    
  }

  async unbanUser (
    userId: string,
    targetId: string,
    roomId: string
  ) {

    try {
      const packaged = {
        userId: userId,
        targetId: targetId,
        roomId: roomId
      }
      return await axios.post(BackLink + "/ban/unban", packaged, {headers: authService.getAuthToken()});

    } catch (error: any) {
      chatError.value = {
        open: true,
        message: error.response.data.message
      }
    }
    
  }
  
}

const banService = new BanService();

export default banService;
