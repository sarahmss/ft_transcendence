import axios from "axios";
import { BackLink } from "../../common/constants";
import authService from "../auth.service";
import { chatError } from "../../contexts/ChatContext";

class QueryService {

  async queryRoom(
    pattern: string
  ) {

    try {
      const room = await axios.get(
        `${BackLink}/room/query?q=${pattern}`,
        {headers: authService.getAuthToken()}
      );    
      return room.data;
      
    } catch (error: any) {
      chatError.value = {
        open: true,
        message: error.response.data.message
      }
    }
  }

  async queryUser(
    pattern: string
  ) {

    try {
      const userList = await axios.get(
        `${BackLink}/room/queryUser?q=${pattern}`,
        {headers: authService.getAuthToken()}
      );

      return userList.data;
    } catch (error: any) {
      chatError.value = {
        open: true,
        message: error.response.data.message
      }
    }
  }

  queryUserSync(
    pattern: string,
    setData: any
  ) {

    try {
      axios.get(`${BackLink}/room/queryUser?q=${pattern}`,
                {headers: authService.getAuthToken()}).then( (response: any) => {

          if (!response || !response.data)
            return;

          const currId = authService.getIdFromToken();

          setData.value = response.data.filter((user: any) => user.userId !== currId);
        }
      );
    } catch (error: any) {
      chatError.value = {
        open: true,
        message: error.response.data.message
      }
    }
  }
}

const queryService = new QueryService();

export default queryService;
