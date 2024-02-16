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
    pattern: string
  ) {

    const userList = await axios.get(
      `${BackLink}/room/queryUser?q=${pattern}`,
      {headers: authService.getAuthToken()}
    );

    return userList.data;
    
  }
}

const queryService = new QueryService();

export default queryService;
