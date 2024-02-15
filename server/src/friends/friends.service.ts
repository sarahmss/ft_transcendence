import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Friends } from 'src/entity/friends.entity';
import { UsersService } from 'src/users/users.service';
import { FriendshipStatus } from 'src/helpers/types.helper';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';

@Injectable()
export class FriendshipService {
  private server: Server;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Friends)
    private readonly FriendRepository: Repository<Friends>,
    private readonly usersService: UsersService,

  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  async sendFriendshipStatusUpdate(ownerId: string, friendId: string, status: string) {
    this.server.emit(`friendshipStatusUpdate_${ownerId}_${friendId}`, { status });
  }

  private async getUserWithFriends(userId: string): Promise<User> {
    try {
      await this.usersService.checkUser(userId);
      const user = await this.usersRepository.findOne({ 
        where: { userId: userId },
        relations: ['friends'], 
      });
      return user;                
    } catch (error) {
      throw error;
    }
  }

  private async IsNewFriendshipValid(user: User, friendId: string): Promise<boolean> {
    try {
      if (!user.friends) {
        return true;
      }
      const exists = user.friends.find(friendship => friendship.friendId === friendId);
      if (exists) {
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async GetFriends(userId: string) {
    try {
      const user = await this.getUserWithFriends(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user.friends;
    } catch (error) {
      console.error("Error GetFriends", error);
      throw new BadRequestException(error);
    }
  }

  async getFriendshipStatus(ownerId: string, friendId: string, response: any) {
    try {
      const user = await this.getUserWithFriends(ownerId);
      let friends = FriendshipStatus.NOREALATION;
      if (user && user.friends) {
        const friendship = user.friends.find(friend => friend.friendId === friendId);
        if (friendship) {
          friends = friendship.status;
        }
      }
      return response.send({ FriendshipStatus: friends });
    } catch (error) {
      console.error("Error GettingFriendshipStatus", error);
      throw new BadRequestException(error);
    }
  }

  private async CreateNewFriendship(ownerId: string, friendId: string, status: FriendshipStatus) {
    try {
      const user = await this.getUserWithFriends(ownerId);
      if (user && this.IsNewFriendshipValid(user, friendId)){
        const Friendship = new Friends();
        Friendship.friendId = friendId;
        Friendship.status = status;
        user.friends.push(Friendship);
        await this.usersRepository.save(user);                
      }
    } catch (error) {
      console.error("Error CreateNewFriendship", error);
      throw new BadRequestException(error);
    }
  }

  private async UpdateFriendshipStatus(ownerId: string, friendId: string, status: FriendshipStatus) {
    try {
      const user = await this.getUserWithFriends(ownerId);
      if (user){
        const friendship = user.friends.find(friendship => friendship.friendId === friendId);
        if (friendship) {
          friendship.status = status;
          await this.usersRepository.save(user);                
        } else {
          throw new BadRequestException('Friendship not found');
        }
      } else {
        throw new BadRequestException('User not found');
      }
    } catch (error) {
      console.error("Error UpdateFriendshipStatus", error);
      throw new BadRequestException(error.message);
    }
  }
  

  private async RemoveFriendship(ownerId: string, friendId: string) {
    try {
      const user = await this.getUserWithFriends(ownerId);
      user.friends = user.friends.filter(friend => friend.friendId !== friendId);
      await this.usersRepository.save(user);
    } catch (error) {
      console.error("Error RemoveFriendship", error);
      throw new BadRequestException(error);
    }
  }
  
  async SendFriendshipRequest(ownerId: string, friendId: string, response: any) {
    await this.CreateNewFriendship(ownerId, friendId, FriendshipStatus.SENT);
    await this.CreateNewFriendship(friendId, ownerId, FriendshipStatus.RECEIVED);

    await this.sendFriendshipStatusUpdate(ownerId, friendId, FriendshipStatus.SENT);
    await this.sendFriendshipStatusUpdate(friendId, ownerId, FriendshipStatus.RECEIVED);
    
    return response.send({ FriendshipStatus: FriendshipStatus.SENT });
  }

  async AcceptFriendshipRequest(ownerId: string, friendId: string, response: any) {
    await this.UpdateFriendshipStatus(ownerId, friendId, FriendshipStatus.FRIENDS);
    await this.UpdateFriendshipStatus(friendId, ownerId, FriendshipStatus.FRIENDS);

    await this.sendFriendshipStatusUpdate(ownerId, friendId,  FriendshipStatus.FRIENDS);
    await this.sendFriendshipStatusUpdate(friendId, ownerId,  FriendshipStatus.FRIENDS);
    
    return response.send({ FriendshipStatus: FriendshipStatus.FRIENDS });
  }

  async DenyFriendshipRequest(ownerId: string, friendId: string, response: any) {
    await this.RemoveFriendship(ownerId, friendId);
    await this.RemoveFriendship(friendId, ownerId);

    await this.sendFriendshipStatusUpdate(ownerId, friendId, FriendshipStatus.DENIED);
    await this.sendFriendshipStatusUpdate(friendId, ownerId, FriendshipStatus.DENIED);
    
    response.send({ FriendshipStatus: FriendshipStatus.DENIED });
  }

  async RemoveFriend(ownerId: string, friendId: string, response: any) {
    await this.RemoveFriendship(ownerId, friendId);
    await this.RemoveFriendship(friendId, ownerId);

    await this.sendFriendshipStatusUpdate(ownerId, friendId, FriendshipStatus.REMOVED);
    await this.sendFriendshipStatusUpdate(friendId, ownerId, FriendshipStatus.REMOVED);
  
    return response.send({ FriendshipStatus: FriendshipStatus.REMOVED });
  }


}