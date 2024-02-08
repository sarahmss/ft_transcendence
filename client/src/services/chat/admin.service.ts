import axios from "axios";
import { BackLink } from "../../common/constants";

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
      await axios.patch(BackLink + "/admin", packaged);

    } catch (error) {
      console.log(error);
      throw error;

    }
    
  }
}

const adminService = new AdminService();

export default adminService;
