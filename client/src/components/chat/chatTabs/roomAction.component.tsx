import { Autocomplete,
  Button,
  IconButton,
  ListItem,
  TextField } from "@mui/material";
import { Box } from "@mui/system";
import * as _ from 'lodash';
import React from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import inviteService from "../../../services/chat/invite.service";
import authService from "../../../services/auth.service";
import roomService from "../../../services/chat/room.service";
import queryService from "../../../services/chat/query.service";
import { chatData, currentRoom, privilegedInRoom } from "../../../contexts/ChatContext";
import { GROUP } from "../../../common/constants";


const InviteComponent = () => {

  const [selectShow, setShowSelect] = React.useState(false);

  const toggleSelectShow = () => {
    setShowSelect(!selectShow);
  }
  

  return (
    <Box>
      <ListItem>
          <Button onClick={toggleSelectShow}>
            Invite User
          </Button>
          <UserInviteComponent/>
      </ListItem>
    </Box>
  );
  
}

const userList = signal([{userName: "", userId: ""}]);
const input = signal("");

const UserInviteComponent = () => {

  useSignals();
  const [value, setValue] = React.useState<any | null>(null);

  const handleChange = (event: any, value: any) => {

    setValue(value);
  }

  const getUsers = (input: string) => {

    if (input.trim().length > 0) {

      queryService.queryUserSync(input, userList);

      if (userList.value.length === 0)
        userList.value = [{userName: "", userId: ""}]
    }
  }

  const debounceFn = React.useCallback(_.debounce(getUsers, 300, {trailing: true, leading: false}), []);

  const handleInputChange = (event: any, value: any) => {

    input.value = value;
    debounceFn(input.value);
  }

  const sendInvitation = () => {
    
    if (!value)
      return;

    inviteService.createInvite(
      authService.getIdFromToken(),
      currentRoom.value === -1 ?  "" : chatData.value[currentRoom.value].roomId,
      value.userId
    );

    alert(`Invitation sent`);
  }


  return (
    <Box sx={{label: {marginTop: 0}, witdth: '100%'}}>
      <Autocomplete
        id="User-invite-search"

        value={value}
        onChange={handleChange}

        inputValue={input.value}
        onInputChange={handleInputChange}

        options={userList.value}
        getOptionLabel={(option: any) => option.userName}
        isOptionEqualToValue={(option: any, value: any) => option.userId === value.userId}
        sx={{ minWidth: 300 }}
        renderInput={(params) => <TextField {...params} label="Users" />}
      />
      <Button onClick={sendInvitation}>
        Send invitation
      </Button>
    </Box>
  );
}

const PassAndVisibilityComponent = () => {

  useSignals();
  // Password
  const [pass, setPass] = React.useState("");
  const [showPassPrompt, setShowPassPrompt] = React.useState(false);

  const handleChange = (event: any) => {
    setPass(event.target.value);
  }

  const togglePrompt = () => {
    setShowPassPrompt(!showPassPrompt);
  }

  const sendSetPassword = () => {
    if (pass.trim().length > 0) {
      roomService.setPassword(
        authService.getIdFromToken(),
        chatData.value[currentRoom.value].roomId,
        pass
      );
      togglePrompt();
    }
  }

  const sendUnsetPassword = () => {
    roomService.unsetPassword(
      authService.getIdFromToken(),
      chatData.value[currentRoom.value].roomId,
    );
  }

  // Toggle room visibility
  const togglePrivate = () => {
    roomService.togglePrivate(
      authService.getIdFromToken(),
      chatData.value[currentRoom.value].roomId
    );
  }

  return (
    <Box>
      <ListItem>

        {
          chatData.value[currentRoom.value].isProtected.value ? (

          <IconButton onClick={sendUnsetPassword}>
            <LockOpenIcon/>
            Unset password
          </IconButton>
        ) : (
          <IconButton onClick={togglePrompt}>
            <LockIcon/>
            Set password
          </IconButton>
        )
        
        }

        {
          chatData.value[currentRoom.value].isPrivate.value ? (
            <IconButton onClick={togglePrivate}>
              <VisibilityIcon/>
              Unset Private
            </IconButton>
          ) : (
            <IconButton onClick={togglePrivate}>
              <VisibilityOffIcon/>
              Set Private
            </IconButton>
          )
        
        }

      </ListItem>

      {
        showPassPrompt ?
        (
          <Box>
            <TextField
              value={pass}
              onChange={handleChange}
            />
            <Button
              sx={{
                marginTop: 1,
                paddingLeft: 1
              }}
              onClick={sendSetPassword}>
              Send
            </Button>
          </Box>

        ) : (
          <span style={{visibility: 'hidden'}}/>
        )
      }

    </Box>
  );
}

const RoomActionComponent = () => {

  const handleDeleteRoom = () => {
    roomService.deleteRoom(
      chatData.value[currentRoom.value].roomId,
      authService.getIdFromToken()
    );
  }

  return (
    <Box>

      {
        (privilegedInRoom.admin.value || privilegedInRoom.owner.value) &&
          chatData.value[currentRoom.value].roomType === GROUP ?
          (
            <Button onClick={handleDeleteRoom}>
              Delete Room
            </Button>
          ) : (
            <span style={{visibility: 'hidden'}}/>
          )
      }

      <InviteComponent/>


      {
        (privilegedInRoom.admin.value || privilegedInRoom.owner.value) &&
          chatData.value[currentRoom.value].roomType === GROUP ?
          (<PassAndVisibilityComponent/>) : 
          (<span style={{visibility: 'hidden'}}/>)
      }

    </Box>
  );
}

export default RoomActionComponent;
