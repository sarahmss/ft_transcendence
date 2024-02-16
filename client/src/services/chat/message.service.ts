import axios from 'axios';
import { BackLink } from '../../common/constants';
import authService from '../auth.service';


class ChatMessageService {

  formatMessage(
    message: string,
    userId: string,
    roomId: string
  ) {

    return {
      message: {
        message: message,
        userId: userId,
        roomId: roomId
      }
    };
    
  }

  async sendMessage(
    message: string,
    userId: string,
    roomId: string
  ) {

    try {

      const packaged = this.formatMessage(message, userId, roomId);
      await axios.post(BackLink + '/message', packaged, {headers: authService.getAuthToken()});
    } catch (error) {
      console.log('Unable to send the message', error);
    }
  }

  async updateMessage (
    messageId: string,
    userId: string,
    newMessage: string
  ) {
    try {

      const packaged = {
        messageId: messageId,
        newMessage: newMessage,
        userId: userId
      }
      
      const resp = await axios.patch(BackLink + "/message", packaged, {headers: authService.getAuthToken()});
      return resp;
    } catch (error) {
      console.log("update message: " + error);
    }
  }

  async deleteMessage (
    messageId: string,
  ) {
    try {
  
      await axios.delete(BackLink + `/message/${messageId}`, {headers: authService.getAuthToken()});
    } catch (error) {
      console.log(error);
    }
  }

  async getMessage(
    userId: string,
    roomId: string,
    page: number,
    quant: number
  ) {

    const packaged = {
      userId: userId,
      roomId: roomId,
      page: page,
      quant: quant
    }

    try {
      
      const messageList = await axios.post(BackLink + "/message/get", packaged, {headers: authService.getAuthToken()});
      return messageList.data;
    } catch (error) {
      console.log("getMessage: " + error );
    }

  }
}

const messageService = new ChatMessageService();

export default messageService;
