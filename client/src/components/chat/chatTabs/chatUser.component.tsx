import { Box, Avatar, Icon, IconButton, ListItem, ListItemAvatar, ListItemText, Select, InputLabel, FormControl } from "@mui/material";

import LogoutIcon from '@mui/icons-material/Logout';
import StarIcon from '@mui/icons-material/Star';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PunchClockIcon from '@mui/icons-material/PunchClock';

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
  const [showPrompt, setPrompt] = React.useState(false);
  const open = Boolean(anchorEl);
  const [action, setAction] = React.useState(-1);

  const togglePrompt = () => {
    setPrompt(!showPrompt);
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

    roomService.kickUser (
      chatData.value[currentRoom.value].roomId,
      user.userId,
      authService.getIdFromToken()
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
    {action: togglePrompt, label: 'Mute'},
  ];

  // With Privilege
  const privilegedAction = [
    {action: togglePrompt, label: 'Ban'},
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
      {
        showPrompt ? (<TimeSelectComponent user={{ action: action, user: user}} />) : 
        (<span style={{ visibility: 'hidden' }} />)
      }
      
    </Box>
  );
}

const TimeSelectComponent = ({user}: {user: any}) => {

  useSignals();

  const [time, setTime] = React.useState(-1);

  const handleTimeChange = (event: any) => {
    setTime(event.target.value);
  }

  const handleBlock = () => {
    
    blackListService.banSingle(
      authService.getIdFromToken(),
      user.userId,
      chatData.value[currentRoom.value].roomId,
      LOCAL_BLOCK,
      time
    );
  }

  const handleBan = () => {
    
    banService.banUser(
      authService.getIdFromToken(),
      user.userId,
      chatData.value[currentRoom.value].roomId,
      time
    );
  }

  const banOrMuteTarget = () => {

    if (time <= 0)
      return;

    switch (user.action) {
      case 1:
        handleBan();
        break;
      case 2:
        handleBlock();
        break;
    }
    
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 80, label: {marginTop: 0}}} required>
      <InputLabel id="roomtype-select">Room Type</InputLabel>
    
        <Select
          labelId="roomtype-select"
          id="roomtype-select"
          value={time === -1 ? '' : time}
          onChange = {handleTimeChange}
          label="Room Type"
        >

          <MenuItem key={"30seg"} value={30000}>
            30 seg
          </MenuItem>

          <MenuItem key={"1min"} value={60000}>
            1 min
          </MenuItem>

          <MenuItem key={"5min"} value={300000}>
            5 min
          </MenuItem>
        </Select>

        <IconButton onClick={banOrMuteTarget}>
          <PunchClockIcon/>
        </IconButton>
    </FormControl>
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
