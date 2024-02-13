import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { useSignals } from '@preact/signals-react/runtime';
import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tabs } from '@mui/material';

import { Message, User, chatData, currentRoom, userLogged } from '../../contexts/ChatContext';
import MessageComponent from './chatTabs/message.component';

const label = [
  {k: 0, id: "1", name: "Messsages"},
  {k: 1, id: "2", name: "Users"},
  {k: 2, id: "3", name: "Create Room"},
]

const ChatTabComponent = () => {
  useSignals();

  const [tabs, setValue] = React.useState("1");
  // const messageContainer = React.useRef<HTMLDivElement>(null);

  // const scroll = () => {
  //   const {offsetHeight, scrollHeight, scrollTop} = messageContainer.current as HTMLDivElement;
  //   // if (scrollHeight <= scrollTop + offsetHeight + 100) {
  //     messageContainer.current?.scrollTo(0, scrollHeight);
  //   // }
  // };

  // React.useEffect(() => {
  //   console.log("well?");
  //   scroll();
  // }, [messageCurrent.value]);

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
                return (<Tab key={tab.k} label={tab.name} value={tab.id} />);
              })
            ) :
            (
              label.map((tab) => {
                return (<Tab key={tab.k} label={tab.name} value={tab.id} disabled />);
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
          key="Messages"
          value="1"
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
          value="2"
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
          value="3"
        >

          Item three
        </TabPanel>
      </TabContext>
    </Box>
  );
}

const MessageTabComponent = () => {

  return (
    <div>
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
    </div>
  );
}

function generate(element: React.ReactElement) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

const ParticipantTabComponent = () => {
  
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
        <Grid item xs={12} md={6}>
            <List>
              {generate(
                <ListItem
                  sx={{ minWidth: 375 }}
                >

                  <IconButton sx={{justifyContent: 'flex-end'}} aria-label="delete">
                    <DeleteIcon/>
                  </IconButton>
                  <IconButton sx={{justifyContent: 'flex-end'}} aria-label="delete">
                    <DeleteIcon/>
                  </IconButton>
                  <IconButton sx={{justifyContent: 'flex-end'}} aria-label="delete">
                    <DeleteIcon/>
                  </IconButton>

                  <ListItemAvatar>
                    <FolderIcon />
                  </ListItemAvatar>

                  <ListItemText
                    primary="Single-line item"
                    secondary='Secondary text'
                  />

                  <IconButton sx={{justifyContent: 'flex-end'}} aria-label="delete">
                    <DeleteIcon/>
                  </IconButton>

                </ListItem>,
              )}
            </List>
        </Grid>
    </Box>
  );
}

export default ChatTabComponent;
