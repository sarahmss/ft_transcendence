import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Typography, Grid, List, Tabs } from '@mui/material';
import { Message, User, chatData, currentRoom, userLogged } from '../../contexts/ChatContext';
import { useSignals } from '@preact/signals-react/runtime';

import ChatUser from './chatTabs/chatUser.component';
import MessageComponent from './chatTabs/message.component';
import RoomCreationComponent from './chatTabs/roomCreation.component';
import SearchRoomComponent from './chatTabs/searchRoom.component';
import RoomActionComponent from './chatTabs/roomAction.component';
import InvitationComponent from './chatTabs/invite.component';

import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import Groups2Icon from '@mui/icons-material/Groups2';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

import {useSelector, useDispatch} from "react-redux";
import {addUser, userLog} from "../../services/reduce";
import { GamepadRoundDown } from 'mdi-material-ui';
import GameInvitationComponent from './chatTabs/gameInvite.component';

const label = [
  {k: 1, id: "1", name: "", icon: SearchIcon},
  {k: 2, id: "2", name: "Messsages", icon: MessageIcon},
  {k: 3, id: "3", name: "Users", icon: Groups2Icon},
  {k: 4, id: "4", name: "Create Room", icon: MeetingRoomIcon},
  {k: 5, id: "5", name: "Room Invite", icon: MailIcon},
  {k: 6, id: "6", name: "Game Invite", icon: VideogameAssetIcon}
]

const MessageStyle = ({ message }: { message: string }) => {
  return(
		<Box sx={{ display: 'flex',
                marginTop: "50%" }}>
        <Typography variant="h4" align="center" 
        sx={{
          mr: 2,
          display:  'flex' ,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: '#B700cc',
          textDecoration: 'none',
          
        }}>
        {message}
        </Typography>
    </Box>
  );
}

const ChatTabComponent = () => {
  useSignals();

  const [tabs, setValue] = React.useState("2");

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <TabContext value={tabs}>
        <Tabs
          value={tabs}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {
            userLogged.value ? 
            (
              label.map((tab) => {
                return (<Tab key={tab.k}
                  label={tab.name}
                  value={tab.id}
                  icon={(<tab.icon/>) }/>);
              })
            ) :
            (
              label.map((tab) => {
                return (<Tab key={tab.k}
                  label={tab.name}
                  value={tab.id}
                  icon={(<tab.icon/>) } disabled/>);
              })
            )
          }
        </Tabs>

        <TabPanel
          sx={{
            backgroundColor:"gray.200",
            height: '90vh',
            overflowY: 'auto'
          }}
          key="Search"
          value="1"
        >
     
          <SearchRoom/>

        </TabPanel>

        <TabPanel
          sx={{
            backgroundColor:"gray.200",
            height: '90vh',
            overflowY: 'auto'
          }}
          key="Messages"
          value="2"
        >
     
          <MessageTabComponent/>

        </TabPanel>

        <TabPanel
          sx={{
            backgroundColor:"gray.200",
            height: '90vh',
            overflowY: 'auto'
          }}
          key="Participants"
          value="3"
        >

          <ParticipantTabComponent/>

        </TabPanel>

        <TabPanel
          sx={{
            backgroundColor:"gray.200",
            height: '90vh',
            overflowY: 'auto'
          }}
          key="Create Room"
          value="4"
        >
          <RoomCreationForm />
        </TabPanel>

        <TabPanel
          sx={{
            backgroundColor:"gray.200",
            height: '90vh',
            overflowY: 'auto'
          }}
          key="Invitation"
          value="5"
        >
          <Invitation/>
        </TabPanel>

        <TabPanel
          sx={{
            backgroundColor:"gray.200",
            height: '90vh',
            overflowY: 'auto'
          }}
          key="GameInvitation"
          value="6"
        >
          <GameInvitation/>
        </TabPanel>

      </TabContext>
    </Box>
  );
}

const MessageTabComponent = () => {
  const users = useSelector(userLog);
	const dispatch = useDispatch();
  let ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scrollToBottom = () =>{
      ref.current?.scrollIntoView({behavior:'smooth'})
    }

    const timerId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timerId);
  }, [users]);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      {
        currentRoom.value > -1 ?
  			(
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, minWidth: 300, maxWidth: 600 }}>
  					{chatData.value[currentRoom.value].messages.value.map((message: Message) => (
  						<MessageComponent key={message.messageId} message={message} />
  					))}
            <div ref={ref}></div>
  				</Box>
        ) :
        (
          <MessageStyle message="Please, select a Room!" />
        )
      }
    </Box>
  );
}

const ParticipantTabComponent = () => {

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            {
              currentRoom.value !== -1 ?
                (
                  <Grid item xs={12} md={6}>
                    <List>
                      <RoomActionComponent/>
                      {
                        chatData.value[currentRoom.value].userList.value.map( (userData: User) => {
                          return (<ChatUser key={userData.userId} user={userData} />);
                        })
                      }
                    </List>
                  </Grid>
                ) :
                (
                  <MessageStyle message="Please, select a Room!" />
                )
            }
    </Box>
  );
}

const RoomCreationForm = () => {
  return (
    <Box>
      <RoomCreationComponent/>
    </Box>
  );
}

const SearchRoom = () => {
  return (
    <SearchRoomComponent/>
  );
}

const Invitation = () => {
  return (
    <Box>
      <InvitationComponent/>
    </Box>
  );
}

const GameInvitation = () => {
  
  return (
    <Box>
      <GameInvitationComponent/>
    </Box>
  );
}

export default ChatTabComponent;
