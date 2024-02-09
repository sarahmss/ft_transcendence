import React from 'react';
import {
  Stack,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography
} from '@mui/material';
import './css/game_styles.css';
import PeopleIcon from '@mui/icons-material/People';
interface PlayerListProps {
  players: {
    [key: string]: {
      name: string;
    };
  };
} 

const PlayerList: React.FC<PlayerListProps> = (props) => {
  
  return (
    <Card >
      <CardHeader
        title='Users'
        action={
            <PeopleIcon/>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
            If an opponent is available you can play against them
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
      <Box className='list-group flex-center'>

        {Object.keys(props.players).map((key) => (
          <Stack key={key} className='list-item flex-center'>
            {props.players[key].name}
          </Stack>
        ))}
      </Box>     

    </Card>

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
