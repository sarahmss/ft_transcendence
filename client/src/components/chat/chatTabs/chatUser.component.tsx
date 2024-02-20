import { Box, Avatar, Icon, IconButton, ListItem, ListItemAvatar, ListItemText, Select, InputLabel, FormControl } from "@mui/material";

import LogoutIcon from '@mui/icons-material/Logout';
import StarIcon from '@mui/icons-material/Star';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PunchClockIcon from '@mui/icons-material/PunchClock';

import { User, chatData, currentRoom, privilegedInRoom } from "../../../contexts/ChatContext";
import React, {useState, useEffect} from "react";
import { LOCAL_BLOCK } from "../../../common/constants";
import { useSignals } from "@preact/signals-react/runtime";

import userService from "../../../services/user.service";
import roomService from "../../../services/chat/room.service";
import authService from "../../../services/auth.service";
import adminService from "../../../services/chat/admin.service";
import banService from "../../../services/chat/ban.service";
import blackListService from "../../../services/chat/blacklist.service";
import { Link } from "react-router-dom";

const UserActionChatComponent = ({user}: {user: User}) => {

  useSignals();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showPrompt, setPrompt] = React.useState(false);
  const [action, setAction] = React.useState(-1);
  const open = Boolean(anchorEl);

  const togglePrompt = () => {
    setPrompt(!showPrompt);
  }

  const togglePromptAndSet = (event: any) => {
    togglePrompt();
    setAction(event.target.value);
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
  // const unprivilegedAction = [
  //   {id: 1, action: togglePromptAndSet, label: 'Mute'},
  //   {id: 2, action: () => {}, label: 'invite'},
  // ];

  // // With Privilege
  // const privilegedAction = [
  //   {id: 3, action: togglePromptAndSet, label: 'Ban'},
  //   {id: 4, action: handleKick, label: 'Kick'},
  //   {id: 5, action: handleToggleAdmin, label: 'Toggle admin'},
  // ];
  const unprivilegedAction = [
    {id: 1, action: togglePromptAndSet, label: 'Mute'},
  ];

  // With Privilege
  const privilegedAction = [
    {id: 2, action: togglePromptAndSet, label: 'Ban'},
    {id: 3, action: handleKick, label: 'Kick'},
    {id: 4, action: handleToggleAdmin, label: 'Toggle admin'},
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
          <MenuItem value={action.id} key={action.label} onClick={action.action}>
            {action.label}
          </MenuItem>
        ))}

        {
          privilegedInRoom.admin.value || privilegedInRoom.owner.value ?
            (
              privilegedAction.map((action) => (
                <MenuItem value={action.id} key={action.label} onClick={action.action}>
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
        showPrompt ? (<TimeSelectComponent userData={{ action: action, user: user, togglePrompt: togglePrompt}} />) : 
        (<span style={{ visibility: 'hidden' }} />)
      }
      
    </Box>
  );
}

const TimeSelectComponent = ({userData}: {userData: any}) => {

  useSignals();

  const [time, setTime] = React.useState(-1);
  const {action, user, togglePrompt} = userData;

  const handleTimeChange = (event: any) => {
    setTime(event.target.value);
  }

  const handleBlock = () => {
    
    togglePrompt();

    blackListService.banSingle(
      authService.getIdFromToken(),
      user.userId,
      chatData.value[currentRoom.value].roomId,
      LOCAL_BLOCK,
      time
    );
  }

  const handleBan = () => {
    
    togglePrompt();

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

    switch (action) {
      case 1:
        handleBlock();
        break;
      case 2:
        handleBan();
        break;
      default:
        console.log("unknown action");
    }
    
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 80, label: {marginTop: 0}}} required>
      <InputLabel id="roomtype-select">Time</InputLabel>
    
        <Select
          labelId="roomtype-select"
          id="roomtype-select"
          value={time === -1 ? '' : time}
          onChange = {handleTimeChange}
          label="Interval"
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
	const [profilePic, setProfilePic] = useState('');

	const fetchData = async () => {
		try {
			const picture = await userService.getProfilePicture(user.profileImage.value, user.userId);
			setProfilePic(picture);
		  } catch (error) {
			console.error("Error fetching user data:", error);
		  }
	  };
	
	  useEffect(() => {
		fetchData();
	  }, );

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

      <Link to={`/profile?user=${user.userId}`}>
        <ListItemAvatar>
          <Avatar src={profilePic}/>
        </ListItemAvatar>
      </Link>

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
