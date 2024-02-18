
import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import { useSignals } from '@preact/signals-react/runtime';
import { invitationIdList } from '../../../contexts/ChatContext';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import inviteService from '../../../services/chat/invite.service';
import authService from '../../../services/auth.service';

const InvitationComponent = () => {

  useSignals();

  return (
    <Box>
      <List>
        {

          invitationIdList.value.map( (invite: any) => {
              return (<ListElementComponent key={invite.invitationId} invitation={invite}/>);
            }
          )

        }
      </List>
    </Box>
  );
}

const ListElementComponent = ({invitation} : {invitation: any}) => {

  const acceptHandle = () => {
  
    inviteService.useInvite(
      authService.getIdFromToken(),
      invitation.invitationId,
      true
    );
  }

  const declineHandle = () => {
    inviteService.useInvite(
      authService.getIdFromToken(),
      invitation.invitationId,
      false
    );
    
  }
  
  return (
    <ListItem>

      <ListItemText
        primary={invitation.roomName}
      />

      <IconButton onClick={acceptHandle}>
        <CheckIcon/>
      </IconButton>

      <IconButton onClick={declineHandle}>
        <CloseIcon/>
      </IconButton>

    </ListItem>
  );
}

export default InvitationComponent;
