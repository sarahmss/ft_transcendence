import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { useSignals } from '@preact/signals-react/runtime';
import { FormControl, Grid, List, Tabs } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { Message, User, chatData, currentRoom, userLogged } from '../../contexts/ChatContext';
import MessageComponent from './chatTabs/message.component';
import ChatUser from './chatTabs/chatUser.component';
import RoomCreationComponent from './chatTabs/roomCreation.component';
import SearchRoomComponent from './chatTabs/searchRoom.component';

const label = [
  {k: 1, id: "1", name: "", icon: SearchIcon},
  {k: 2, id: "2", name: "Messsages", icon: ""},
  {k: 3, id: "3", name: "Users", icon: ""},
  {k: 4, id: "4", name: "Create Room", icon: ""},
]

const ChatTabComponent = () => {
  useSignals();

  const [tabs, setValue] = React.useState("2");

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <TabContext value={tabs}>
        <Tabs value={tabs} onChange={handleChange} centered>
          {
            userLogged.value ? 
            (
              label.map((tab) => {
                return (<Tab key={tab.k}
                  label={tab.name}
                  value={tab.id}
                  icon={tab.icon === "" ? ("") : (<tab.icon/>) }/>);
              })
            ) :
            (
              label.map((tab) => {
                return (<Tab key={tab.k}
                  label={tab.name}
                  value={tab.id}
                  icon={tab.icon === "" ? ("") : (<tab.icon/>) } disabled/>);
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
      </TabContext>
    </Box>
  );
}

const MessageTabComponent = () => {

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      {
        currentRoom.value > -1 ?
  			(
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, minWidth: 300, maxWidth: 600 }}>
  					{chatData.value[currentRoom.value].messages.value.map((message: Message) => (
  						<MessageComponent key={message.messageId} message={message} />
  					))}
  				</Box>
        ) :
        (
          <div>
            Please select a room!
          </div>
        )
      }
    </Box>
  );
}

const ParticipantTabComponent = () => {
  
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
        <Grid item xs={12} md={6}>
            {
              currentRoom.value !== -1 ?
                (
                  <List>
                    {
                      chatData.value[currentRoom.value].userList.value.map( (userData: User) => {
                        return (<ChatUser key={userData.userId} user={userData} />);
                      })
                    }
                  </List>
                ) :
                (
                  <div>
                    Please select a room!
                  </div>
                )
            }
        </Grid>
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

export default ChatTabComponent;
