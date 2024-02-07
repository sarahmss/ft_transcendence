import React, { useContext } from 'react';
import PlayerList from './PlayerList';
import { GameContext, addOnQueue, State } from '../../contexts/GameContext';
import Rooms from './Rooms';
import Queue from './Queue';
import Customizing from './Customizing';
import PongGame from './Game';
import {
	Button,
	Box
} from '@mui/material';
import './css/game_styles.css';

import { Navigate } from 'react-router-dom';

const Pong: React.FC = () => {
  const { isConnected, isUserLogged, players, match, current_player } = useContext(GameContext) as State;

  return (
	<>
		
			{isUserLogged ?
			(
			<>
			{!isConnected && <Box>Connecting...</Box>}
			{current_player?.name && !current_player?.state && (
				<Box component="span" className='list-title'>
				{!current_player?.state && !current_player?.room && (
					<Button
						variant="contained"
						size="large"
						onClick={addOnQueue}
						sx={{backgroundColor:"#B700cc", mb:5}}
					>
						Enter a game
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
				<Box style={{ width: '100%' }}>
				<Box className='list-container'>
					<Rooms />
					<PlayerList players={players} />
				</Box>
				</Box>
			)}
			
				</>
		) : (
			<Navigate to="/" />
		)}
		</>
  );
};

export default Pong;
