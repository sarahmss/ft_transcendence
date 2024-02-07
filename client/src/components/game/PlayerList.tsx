import React from 'react';
import {
  Stack,
  Box
} from '@mui/material';
import './css/game_styles.css';

interface PlayerListProps {
  players: {
    [key: string]: {
      name: string;
    };
  };
}

const PlayerList: React.FC<PlayerListProps> = (props) => {
  
  return (
    <Box className='list-group flex-center'>
      <Box component="span" className='list-title flex-center'>Users</Box>
      {Object.keys(props.players).map((key) => (
         <Stack key={key} className='list-item flex-center'>
           {props.players[key].name}
         </Stack>
       ))}
    </Box>
  );

  // return (
  //   <Box sx={{ mb: 20 }} display="flex" flexDirection="column">
  //     <Box component="span" sx={{ color: 'rgb(97, 0, 130)', fontSize: '20px', fontWeight: 'bold' }} display="flex" alignItems="center" justifyContent="space-between" mb={10}>Users</Box>
  //     {Object.keys(props.players).map((key) => (
  //        <Stack key={key}>
  //          {props.players[key].name}
  //        </Stack>
  //      ))}
  //   </Box>
  // );
  
  // return (
  //   <div className='list-group'>
  //     <span className='list-title'>Users</span>
  //     {Object.keys(props.players).map((key) => (
  //       <div key={key} className='list-item'>
  //         {props.players[key].name}
  //       </div>
  //     ))}
  //   </div>
  // );
};

export default PlayerList;
