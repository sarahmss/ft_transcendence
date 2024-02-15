import axios from "axios";
import { BackLink } from "../../common/constants";
import authService from "../auth.service";

class QueryService {

  async queryRoom(
    pattern: string
  ) {

    const room = await axios.get(
      `${BackLink}/room/query?q=${pattern}`,
      {headers: authService.getAuthToken()}
    );    
    return room.data;
  }

  async queryUser(
    
  ) {
    
  }
}

const queryService = new QueryService();

export default queryService;
