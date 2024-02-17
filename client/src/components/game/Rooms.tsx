import React, { useContext } from 'react';
import { GameContext, enterSpectator, State} from '../../contexts/GameContext';
import {
    Typography,
    Button,
    Stack,
    Box,
    Card,
    CardContent,
    CardHeader
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const Rooms: React.FC = () => {
  const { current_player, rooms } = useContext(GameContext) as State;

  return (
    <Card>
      <CardHeader
        title='Open Rooms'
        action={
            <MeetingRoomIcon />
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              If a match is happening you can watch it...
            </Box>{' '}
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}

      />
      <CardContent>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif'
          }}>
          {!current_player.room &&
            Object.keys(rooms).map((key) => (
          (rooms[key].player1 && rooms[key].player2) ? (
              <Stack key={`room_${key}`} justifyContent="space-between" alignItems="center" spacing={3}>
                {rooms[key].name}
            
                  <Button
                    onClick={() => enterSpectator(key)}
                    disabled={!rooms[key].player1 || !rooms[key].player2}
                    sx={{ backgroundColor:"#B700cc", color: "#fff" }}
                  >
                    Watch Match
                </Button>                
              </Stack> 
              )
          : null
          ))}
        </Box>
      </CardContent>
    </Card>


  );
  // return (
  //   <div className='list-group'>
  //     <span className='list-title'>
  //       Open Rooms
  //     </span>
  //     {!current_player.room &&
  //       Object.keys(rooms).map((key) => (
	// 		(rooms[key].player1 && rooms[key].player2) ? (
  //         <div key={`room_${key}`} className='list-item'>
  //           {rooms[key].name}
  //           <button
  //             onClick={() => enterSpectator(key)}
  //             disabled={!rooms[key].player1 || !rooms[key].player2}
  //           >
  //             Watch Match
  //           </button>
  //         </div>)
	// 	  : null
  //       ))}
  //   </div>
  // );
};

export default Rooms;
