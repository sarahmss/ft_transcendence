
import { Button , List, ListItem, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import { useSignals } from '@preact/signals-react/runtime';
import { invitationIdList } from '../../../contexts/ChatContext';

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
  
    console.log("accepted");
  }

  const declineHandle = () => {

    console.log("Joined");
  }
  
  return (
    <ListItem>

      <ListItemText
        primary={invitation.roomName}
      />

      <Button onClick={acceptHandle}>
        Join
      </Button>

      <Button onClick={declineHandle} sx={{backgroundColor:"#B700cc"}}>
        Decline
      </Button>

    </ListItem>
  );
}

export default InvitationComponent;
