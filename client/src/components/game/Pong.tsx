import React, { useContext } from 'react';
import PlayerList from './PlayerList';
import { GameContext, addOnQueue, State } from '../../contexts/GameContext';
import Rooms from './Rooms';
import Queue from './Queue';
import Customizing from './Customizing';
import PongGame from './Game';
import {
	Button,
	Box,
	CircularProgress,
	Grid,
	Typography
} from '@mui/material';
import './css/game_styles.css';
import { Navigate } from 'react-router-dom';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import LoadingIllustration from '../../common/LoadingIllustration';

const Connecting = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <Typography variant="h2">
        Connecting...
      </Typography>
      <CircularProgress
        color="secondary"
        variant="indeterminate"
      />
      <LoadingIllustration/>
    </Box>
  );
}

const Pong: React.FC = () => {
  const { isConnected, isUserLogged, players, match, current_player } = useContext(GameContext) as State;

  return (
    <>
      {isUserLogged ?
      (
        <>
          {!isConnected  ?
          (
            <Connecting/>
          ):(
            <>
              {current_player?.name && !current_player?.state && (

                <Box
                  component="span"
                  className='list-title'
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '20px',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                  {!current_player?.state && !current_player?.room && (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={addOnQueue}
                      sx={{backgroundColor:"#B700cc", mb:5}}
                    >
                      Enter a game  
                      <SportsTennisIcon />
                    </Button>
                  )}
                </Box>
              )}
              {current_player?.name && (current_player?.state === 'waiting' || current_player?.state === 'in_room' ) && match?.status !== 'CUSTOM' && (
                <Box component="span" className='list-title'>
                  <Queue />
                </Box>
              )}
              {current_player?.name && match?.status === 'CUSTOM' && current_player?.state !== 'watching' && (
                <Box className='custom-game'>
                  <Customizing />
                </Box>
              )}
              {current_player?.name && match?.status && match?.status !== 'CUSTOM' && (current_player?.state === 'watching' || current_player?.state === 'in_game') && (
                <>
                  <PongGame />
                </>
              )}
              {(current_player?.name && (!match?.status || match?.status !== 'CUSTOM') && !current_player.room && !current_player?.state) && (
                <Box className='list-container' style={{ width: '200%' }}>
                  <Grid container spacing={2}>
                    <Grid item > 
                      <Rooms />
                    </Grid>
                    <Grid item > 
                      <PlayerList players={players} />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </>
          )}                
        </>
      )
      :
      ( <Navigate to="/" /> )}

    </>
  );
};

export default Pong;
