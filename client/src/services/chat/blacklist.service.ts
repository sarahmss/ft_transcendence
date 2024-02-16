import axios from "axios"
import { BackLink } from "../../common/constants";

class BlackListService {

  async banSingle (
    blockerId: string,
    blockedId: string,
    roomId: string,
    blockType: number,
    duration: number
  ) {

    const packaged = {
      blockedId: blockedId,
      blockerId: blockerId,
      roomId: roomId,
      blockType: blockType,
      duration: duration,
    }

    await axios.post(BackLink + "/blacklist/single", packaged);
    
  }

  async banBulk (
    blockerId: string,
    blockedIds: string[],
    blockType: number,
    roomId: number
  ) {
    const packaged = {
      blockerId: blockerId,
      blockedIds: blockedIds,
      blockeType: blockType,
      roomId: roomId
    }

    await axios.post(BackLink + "/ban/bulk", packaged);
  }

  async unblock (
    blockerId: string,
    blockedId: string,
    roomId: string
  ) {
    try {
    const packaged = {
      blockerId: blockerId,
      blockedId: blockedId,
      roomId: roomId,
    }

    await axios.patch(BackLink + "/ban/unblock", packaged);
      
    } catch (error) {
      
      console.log(error);
      throw error;
    }
    
  }
}

const blackListService = new BlackListService();

export default blackListService;
