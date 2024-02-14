import { Box, Avatar, Icon, IconButton, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

import LogoutIcon from '@mui/icons-material/Logout';
import StarIcon from '@mui/icons-material/Star';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { User, chatData, currentRoom, privilegedInRoom } from "../../../contexts/ChatContext";
import React from "react";
import blackListService from "../../../services/chat/blacklist.service";
import banService from "../../../services/chat/ban.service";
import adminService from "../../../services/chat/admin.service";
import authService from "../../../services/auth.service";
import { LOCAL_BLOCK } from "../../../common/constants";
import roomService from "../../../services/chat/room.service";
import { useSignals } from "@preact/signals-react/runtime";

const UserActionChatComponent = ({user}: {user: User}) => {

  useSignals();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleBlock = () => {
    
    blackListService.banSingle(
      authService.getIdFromToken(),
      user.userId,
      chatData.value[currentRoom.value].roomId,
      LOCAL_BLOCK,
      300000
    );
    handleClose();
  }

  const handleBan = () => {
    
    banService.banUser(
      authService.getIdFromToken(),
      user.userId,
      chatData.value[currentRoom.value].roomId,
      300000
    );
    handleClose();
  }

  const handleToggleAdmin = () => {
    
    adminService.toggleAdmin(
      authService.getIdFromToken(),
      user.userId,
      chatData.value[currentRoom.value].roomId,
    );
    handleClose();
  }

  const handleKick = () => {

    roomService.leaveRoom (
      user.userId,
      chatData.value[currentRoom.value].roomId,
    );
    handleClose();
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  // Unprivileged actions
  const unprivilegedAction = [
    {action: handleBlock, label: 'Mute'},
  ];

  // With Privilege
  const privilegedAction = [
    {action: handleBan, label: 'Ban'},
    {action: handleKick, label: 'Kick'},
    {action: handleToggleAdmin, label: 'Toggle admin'},
  ];
  
  return (
    <Box>
    <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx= {{
          maxHeight: 48 * 4.5,
          width: '20ch',
        }}
      >
        {unprivilegedAction.map((action) => (
          <MenuItem key={action.label} onClick={action.action}>
            {action.label}
          </MenuItem>
        ))}

        {
          privilegedInRoom.admin.value || privilegedInRoom.owner.value ?
            (
              privilegedAction.map((action) => (
                <MenuItem key={action.label} onClick={action.action}>
                  {action.label}
                </MenuItem>
              ))
            ) :
            (
              (<span style={{ visibility: 'hidden' }} />)
            )
        }
        
      </Menu>
    </Box>
  );
}

const ChatUser = ({user}:{user: User}) => {
  useSignals();

  const handleLeave = () => {
    roomService.leaveRoom (
      authService.getIdFromToken(),
      chatData.value[currentRoom.value].roomId,
    );
  }


  return (

    <ListItem
      sx={{ minWidth: 375 }}
    >
      {
        user.userId !== authService.getIdFromToken() ?
          (<UserActionChatComponent user={user} />) :
          (<span style={{ visibility: 'hidden' }} />)
      }

      {
        user.userId === authService.getIdFromToken() ?
        (
          <IconButton sx={{ justifyContent: 'flex-end'}} onClick={handleLeave}>
            <LogoutIcon />
          </IconButton>
        ) :
        (<span style={{ visibility: 'hidden' }} />)
      }

      <ListItemAvatar>
        <Avatar src={user.profileImage.value}/>
      </ListItemAvatar>

      <ListItemText
        primary={user.userName.value}
        secondary={user.admin.value ? "admin" : "" }
      />

      <Icon sx={{height: '2em', justifyContent: 'flex-end'}} aria-label="owner">
        {user.owner ? (<StarIcon/>) : (<span style={{ visibility: 'hidden' }} />)}
      </Icon>

    </ListItem>
  );
}

export default ChatUser;
