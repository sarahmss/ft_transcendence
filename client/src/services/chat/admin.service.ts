import axios from "axios";
import { BackLink } from "../../common/constants";
import authService from "../auth.service";

class AdminService {

  async toggleAdmin(
    requestorId: string,
    userId: string,
    roomId: string,
  ) {
    try {
      const packaged = {
        requestorId: requestorId,
        userId: userId,
        roomId: roomId
      }
      await axios.patch(BackLink + "/admin", packaged, {headers: authService.getAuthToken()});

    } catch (error) {
    }
    
  }
}

const adminService = new AdminService();

export default adminService;
