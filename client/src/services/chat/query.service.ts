import axios from "axios";
import { BackLink } from "../../common/constants";
import authService from "../auth.service";

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
      
    } catch (error) {
      
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
      
    } catch (error) {
      
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

          setData.value = response.data;
        }
      );
    } catch (error) {
      
    }

  }
}

const queryService = new QueryService();

export default queryService;
