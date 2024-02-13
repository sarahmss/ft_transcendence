import React from 'react';
import { Button, Chip } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import OutboxIcon from '@mui/icons-material/Outbox';
import userService from '../../../services/user.service';

// Defina os tipos ThemeColor e Icons conforme necessário
type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

// Interface para definir os status e suas propriedades
interface StatusObj {
  [key: string]: {
    color: ThemeColor;
    icon: React.ReactNode;
    onClick: ((friendId: string) => void) | null;
  };
}

const Send = async (friendId: string) => {
    try {
        await userService.sendFriendshipRequest(friendId);
    } catch (error) {
        console.error(error);
    }
};

const Accept = async (friendId: string) => {
    try {
        await userService.acceptFriendshipRequest(friendId);
    } catch (error) {
        console.error(error);
    }
};

const Deny = async (friendId: string) => {
    try {
        await userService.denyFriendshipRequest(friendId);
    } catch (error) {
        console.error(error);
    }
};

const Remove = async (friendId: string) => {
    try {
        await userService.removeFriend(friendId);
    } catch (error) {
        console.error(error);
    }
};

const statusObj: StatusObj = {
  AddFriend: { color: 'success', icon: <GroupAddIcon />, onClick: Send },
  RequestSent: { color: 'info', icon: <OutboxIcon />, onClick: null },
  AcceptRequest: { color: 'success', icon: <GroupAddIcon />, onClick: Accept },
  DenyRequest: { color: 'error', icon: <GroupRemoveIcon />, onClick: Deny },
  RemoveFriend: { color: 'error', icon: <GroupRemoveIcon />, onClick: Remove },
  Friends: { color: 'secondary', icon: <GroupIcon />, onClick: null },
  YourSelf: { color: 'info', icon: <GroupIcon />, onClick: null },
};

const FriendsButton = ({status, friendId }: {
  status: string;
  friendId: string;
}) => {

  const handleClick = () => {
    const onClickFunction = statusObj[status]?.onClick;
    if (onClickFunction) {
      onClickFunction(friendId); 
    }
  };

  return (
        <Button
        onClick={handleClick}
        startIcon={statusObj[status]?.icon} 
        variant="contained"
        sx={{ borderRadius: 16 }} 
        color={statusObj[status]?.color || 'error'}
        disabled={status === "YourSelf"}
        >
        {status}
        </Button>
  );
};

export default FriendsButton;
