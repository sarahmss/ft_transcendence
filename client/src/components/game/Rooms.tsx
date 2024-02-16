import React, { useContext } from 'react';
import { GameContext, enterSpectator, State} from '../../contexts/GameContext';
import {
    Typography,
    Button,
    Stack,
    Paper,
    Box
} from '@mui/material';

const Rooms: React.FC = () => {
  const { current_player, rooms } = useContext(GameContext) as State;

  return (
    <Stack spacing={2} sx={{ margin: 'auto' }}>
      <Box component="span" sx={{width: 100, height: 100}}>
        Open Rooms
      </Box>
      {!current_player.room &&
         Object.keys(rooms).map((key) => (
	 		(rooms[key].player1 && rooms[key].player2) ? (
          <Stack key={`room_${key}`} justifyContent="space-between" alignItems="center" spacing={3}>
             {rooms[key].name}
             <Button
                onClick={() => enterSpectator(key)}
                disabled={!rooms[key].player1 || !rooms[key].player2}
                sx={{ backgroundColor:"#B700cc" }}
              >
                Watch Match
             </Button>
           </Stack>)
	 	  : null
         ))}
    </Stack>
  );
};

export default Rooms;
