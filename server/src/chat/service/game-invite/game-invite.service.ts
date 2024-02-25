import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameInvite } from 'src/entity/gameInvite.entity';
import { User } from 'src/entity/user.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class GameInviteService {

  constructor(
    @InjectRepository(GameInvite) private readonly gameInviteRepository: Repository<GameInvite>
  ) {}


  async createInvite(inviter: User, invited: User) {

    const inviteEntry = this.gameInviteRepository.create({
      invited: invited,
      invitedId: invited.userId,
      inviter: inviter,
      inviterId: inviter.userId,
    });

    await this.gameInviteRepository.insert(inviteEntry);

    return inviteEntry;
  }

  async invalidateInvite(inviteId: string) {

    this.gameInviteRepository.update(
      {
        gameInviteId: inviteId,
      },
      {
        status: false
      }
    );
  }


  async getInvite(inviteId: string) {

    return this.gameInviteRepository.findOne({
      where: {
        gameInviteId: inviteId,
        status: true,
        time_limit: MoreThan(new Date()),
      }
    });
  }

  async getInviteByUserPair(inviterId: string) {

    return this.gameInviteRepository.findOne({
      where: 
        {
          inviterId: inviterId,
          status: true,
          time_limit: MoreThan(new Date())
        }
    });
  }

  async getOtherUserFromInvitation(inviteId: string, userId: string) {
    const invite = await this.getInvite(inviteId);

    if (!invite)
      return;

    if (userId === invite.invitedId)
      return invite.inviterId;

    else if (userId === invite.inviterId)
      return invite.invitedId;
  }


  async getInvitationList(userId: string) {
    return this.gameInviteRepository.find(
     {
        where:[
          {
            invitedId: userId,
            status: true,
            time_limit: MoreThan(new Date())
          },
          {
            inviterId: userId,
            status: true,
            time_limit: MoreThan(new Date())
          }
        ]
      }
    );
    
  }
}
