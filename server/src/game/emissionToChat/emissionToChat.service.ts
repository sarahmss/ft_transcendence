
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
        return ({
          gameRoomId: sendData.requestorId,
          userType: sendData.requestorId === userId
                      ? 'host' : 'guest',
          message: `Game Invitation: ${sendData.requestorId === userId ? 'me' : sendData.userName}`,
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
