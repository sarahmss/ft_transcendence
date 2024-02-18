import { Button, IconButton, ListItem, TextField } from "@mui/material";
import { Box } from "@mui/system";
import inviteService from "../../../services/chat/invite.service";
import authService from "../../../services/auth.service";
import { chatData, currentRoom } from "../../../contexts/ChatContext";
import roomService from "../../../services/chat/room.service";
import React from "react";
import { useSignals } from "@preact/signals-react/runtime";


const InviteComponent = () => {

  const [selectShow, setShowSelect] = React.useState(false);

  const toggleSelectShow = () => {
    setShowSelect(!selectShow);
  }
  
  // Invite people
  const sendInvitation = () => {
    inviteService.createInvite(
      authService.getIdFromToken(),
      chatData.value[currentRoom.value].roomId,
      "someone"
    );
  }

  const useInvitation = () => {
    inviteService.useInvite(
      authService.getIdFromToken(),
      "invitationId"
    );
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

const UserInviteComponent = () => {

  return (
    <ListItem>
      name
      <IconButton>
        Send Invitation
      </IconButton>
    </ListItem>
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

  return (
    <Box>

      <InviteComponent/>

      <PassAndVisibilityComponent/>

    </Box>
  );
}

export default RoomActionComponent;
