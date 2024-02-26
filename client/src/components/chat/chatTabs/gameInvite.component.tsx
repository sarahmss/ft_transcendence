
import { Autocomplete, Box,
  Button,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  TextField
} from '@mui/material';

import { useSignals } from '@preact/signals-react/runtime';

import { chatSocket, gameInvitationList } from '../../../contexts/ChatContext';
import { signal } from '@preact/signals-react';
import React from 'react';
import queryService from '../../../services/chat/query.service';
import * as _ from 'lodash';
import gameService from '../../../services/game.service';
import authService from '../../../services/auth.service';
import { FrontGame } from '../../../common/constants';
import { fetchGameInvitations } from '../../../contexts/FetchChatData';

const GameInvitationComponent = () => {

  useSignals();

  return (
    <Box
      sx={{
        '& > :not(style)': { m: 1, label:{ marginTop: 0} },
      }}
      >
			<Grid container spacing={2}>
				<Grid item xs={10}>

          <UserInviteComponent/>


          <List>
            {

              gameInvitationList.value.map( (invite: any) => {
                  return (<ListElementComponent key={invite.invitationId} invitation={invite}/>);
                }
              )

            }
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}

const ListElementComponent = ({invitation} : {invitation: any}) => {

  useSignals();

  const acceptHandle = async () => {

    const status = await gameService.useInvite(authService.getIdFromToken(), invitation.invitationId);

    if (status)
      window.location.href = `${FrontGame}/${invitation.gameRoomId}/${invitation.userType}`;
  }

  const declineHandle = () => {

    gameInvitationList.value = gameInvitationList.value.filter(
      (invite) => 
        invite.invitationId !== invitation.invitationId
    );
    chatSocket.emit('invalidate-invite', {inviteId: invitation.invitationId});
  }
  
  return (
    <ListItem>

      <ListItemText
        primary={invitation.message}
      />

      {
        invitation.gameRoomId === authService.getIdFromToken() ?
          (
            <span style={{visibility: 'hidden'}} />
          ) : (
              <Button onClick={acceptHandle} sx={{backgroundColor:"#B700cc", marginRight: 3, color: 'white'}}>
                <b>Join</b>
              </Button>
          )
      }

      <Button onClick={declineHandle} sx={{backgroundColor:"#B700cc", color: 'white'}}>
        <b>Decline</b>
      </Button>

    </ListItem>
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

      if (userList.value.length === 0) {
        userList.value = [{userName: "", userId: ""}]
      }
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

    gameService.sendInvitation(
      authService.getIdFromToken(),
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

export default GameInvitationComponent;
