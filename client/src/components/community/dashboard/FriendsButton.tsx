import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import OutboxIcon from '@mui/icons-material/Outbox';
import userService from '../../../services/user.service';
import socketClient from 'socket.io-client';
import { FriendsLink, appSocket } from '../../../common/constants';

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

const FriendsButton = ({ prevStatus, friendId, ownerId }: {
  prevStatus: string;
  friendId: string;
  ownerId: string;
}) => {

  const [status, setStatus] = useState(prevStatus);

  const ChangeToAdd = () => {
    setStatus("AddFriend");
  }

  const statusObj: StatusObj = {
    AddFriend: { color: 'success', icon: <GroupAddIcon />, onClick: Send },
    RequestSent: { color: 'info', icon: <OutboxIcon />, onClick: null },
    Friends: { color: 'secondary', icon: <GroupIcon />, onClick: null },
    YourSelf: { color: 'info', icon: <GroupIcon />, onClick: null },
    FriendRemoved:  { color: 'error', icon: <GroupRemoveIcon />, onClick: ChangeToAdd },
    RequestDenied: { color: 'error', icon: <GroupRemoveIcon />, onClick: ChangeToAdd }
  };

  useEffect(() => {
    appSocket.on(`friendshipStatusUpdate_${ownerId}_${friendId}`, (data: { status: string }) => {
      setStatus(data.status);
    });

    return () => {
      appSocket.off(`friendshipStatusUpdate_${ownerId}_${friendId}`);
    };
  }, [friendId, ownerId]);

  const handleClick = () => {
    const onClickFunction = statusObj[status]?.onClick;
    if (onClickFunction) {
      onClickFunction(friendId); 
    }
  };

  return (
    status === "RequestReceived" ? (
      <>
        <Button
          onClick={() => Accept(friendId)}
          endIcon={<GroupAddIcon/>}
          variant="contained"
          sx={{ borderRadius: 16, mr: 2 }}
          color={"success"}
        >
          Accept
        </Button>
        <Button
          onClick={() => Deny(friendId)}
          endIcon={<GroupRemoveIcon/>}
          variant="contained"
          sx={{ borderRadius: 16 }}
          color={"error"}
        >
          Deny
        </Button>
      </>
    ) : (
      <>
        <Button
          onClick={handleClick}
          endIcon={statusObj[status]?.icon} 
          variant="contained"
          sx={{ borderRadius: 16 }} 
          color={statusObj[status]?.color || 'error'}
          disabled={status === "YourSelf"} 
        >
          {status}
        </Button>

      {status === "Friends" ? ( 
        <Button
          onClick={() => Remove(friendId)}
          endIcon={<GroupRemoveIcon />} 
          variant="contained"
          sx={{ borderRadius: 16 }} 
          color='error'
        >
          Remove
        </Button>         
      ):(<></>)}
     
      </>


    )
  );
};

export default FriendsButton;
