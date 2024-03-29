
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EmissionToChatService {

  constructor (
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2
  ) {}
  
  emitDataToChatSocket (
    event: string,
    recipients: string[],
    data: any,
    emission_event: string,
  ) {

    const cb = (userId: string, __: any, sendData: any = data) => {
      console.log('EM cb, client id - data: ', data);
      console.log('EM cb, client id - sendData: ', sendData);   
      return ({
          gameRoomId: sendData.requestorId,
          userType: sendData.requestorId === userId
                      ? 'host' : 'guest',
          message: `Game Invitation: ${sendData.requestorId === userId ? 'me' : sendData.userName}`,
          invitationId: data.invitation ? data.invitation : undefined,
        })
      };
    
    this.eventEmitter.emit(event,
      recipients,
      "",
      emission_event,
      cb
    );
  }

}
