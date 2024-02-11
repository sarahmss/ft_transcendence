import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { userLogged } from '../../contexts/ChatContext';
import { useSignals } from '@preact/signals-react/runtime';

const label = ["Messsages", "Users", "Create Room"]

const ChatTabComponent = () => {
  useSignals();
  const [value, setValue] = React.useState(0);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        {
          userLogged ? 
          (
            label.map((tabName) => {
              return (<Tab key={tabName} label={tabName} />);
            })
          ) :
          (
            label.map((tabName) => {
              return (<Tab key={tabName} label={tabName} disabled />);
            })
          )
        }
      </Tabs>
    </Box>
  );
}

export default ChatTabComponent;
