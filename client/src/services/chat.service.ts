import axios from 'axios';

import AuthService from './auth.service';
import { ChatLink } from '../common/constants';

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
      message = await axios.post(ChatLink, packaged);
    } catch (error) {
      console.log('Unable to send the message', error);
      throw error;
    }
  }

  async updateMessage (
    messageId: string,
    newMessage: string
  ) {
    try {
      const packaged = {}
      
    } catch (error) {
      
    }
  }

  
}
