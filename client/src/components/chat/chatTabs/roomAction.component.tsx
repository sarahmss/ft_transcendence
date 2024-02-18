import { Autocomplete, Button, IconButton, ListItem, TextField } from "@mui/material";
import { Box } from "@mui/system";
import inviteService from "../../../services/chat/invite.service";
import authService from "../../../services/auth.service";
import { chatData, currentRoom } from "../../../contexts/ChatContext";
import roomService from "../../../services/chat/room.service";
import React, { useCallback } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import queryService from "../../../services/chat/query.service";
import * as _ from 'lodash';
import { SupervisedUserCircle } from "@mui/icons-material";
import { signal } from "@preact/signals-react";


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

function debounceFunction (func: any, delay: number = 1000) {

  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(
      () => {
        func(...args)
    }, delay)
  }
  
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
            Unset password
          </IconButton>
        ) : (
          <IconButton onClick={togglePrompt}>
            Set password
          </IconButton>
        )
        
        }

        {
          chatData.value[currentRoom.value].isPrivate.value ? (
            <IconButton onClick={togglePrivate}>
              Unset Private
            </IconButton>
          ) : (
            <IconButton onClick={togglePrivate}>
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

      <Button onClick={handleDeleteRoom}>
        Delete Room
      </Button>

      <InviteComponent/>

      <PassAndVisibilityComponent/>

    </Box>
  );
}

export default RoomActionComponent;
