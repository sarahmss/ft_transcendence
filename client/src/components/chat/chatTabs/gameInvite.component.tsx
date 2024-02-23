
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

import { gameInvitationList } from '../../../contexts/ChatContext';
import { signal } from '@preact/signals-react';
import React from 'react';
import queryService from '../../../services/chat/query.service';
import * as _ from 'lodash';
import gameService from '../../../services/game.service';
import authService from '../../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { FrontGame } from '../../../common/constants';

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
                  return (<ListElementComponent key={invite.id} invitation={invite}/>);
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
  const navigate = useNavigate();

  const acceptHandle = () => {
  
    navigate(`game/${invitation.gameRoomId}/${invitation.userType}`);
  }

  const declineHandle = () => {

    const index = invitation.id;

    gameInvitationList.value = gameInvitationList.value.filter(
      (invite) => 
        invite.id !== invitation.id
    );

    if (gameInvitationList.value.length > 0) {
      for (let i = index; i < gameInvitationList.value.length; i++ ) {
        gameInvitationList.value[i].id = i;
      }
    }
  }
  
      // <Button  onClick={acceptHandle} sx={{backgroundColor:"#B700cc", marginRight: 3, color: 'white'}}>
  return (
    <ListItem>

      <ListItemText
        primary={invitation.message}
      />

      <Link href={`${FrontGame}/${invitation.gameRoomId}/${invitation.userType}`}>
        <Button sx={{backgroundColor:"#B700cc", marginRight: 3, color: 'white'}}>
          <b>Join</b>
        </Button>
      </Link>

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
