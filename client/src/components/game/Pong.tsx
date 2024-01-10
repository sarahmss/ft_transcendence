import React, { useContext } from 'react';
import PlayerList from './PlayerList';
import { GameContext, addOnQueue, State } from '../../contexts/GameContext';
import Rooms from './Rooms';
import Queue from './Queue';
import Customizing from './Customizing';
import PongGame from './Game';
import { Navigate } from 'react-router-dom';

const Pong: React.FC = () => {
  const { isConnected, isUserLogged, players, match, current_player } = useContext(GameContext) as State;

  return (
	<>
		{isUserLogged ? (
    	<>
    	  {!isConnected && <div>Connecting...</div>}
    	  {current_player?.name && !current_player?.state && (
    	    <span className='list-title'>
    	      {!current_player?.state && !current_player?.room && (
    	        <button onClick={addOnQueue}>Enter a game</button>
    	      )}
    	    </span>
    	  )}
    	  {current_player?.name && (current_player?.state === 'waiting' || current_player?.state === 'in_room' ) && match?.status !== 'CUSTOM' && (
    	    <span className='list-title'>
    	      <Queue />
    	    </span>
    	  )}
    	  {current_player?.name && match?.status === 'CUSTOM' && current_player?.state !== 'watching' && (
    	    <div className='custom-game'>
    	      <Customizing />
    	    </div>
    	  )}
		  {current_player?.name && match?.status && match?.status !== 'CUSTOM' && (current_player?.state === 'watching' || current_player?.state === 'in_game') && (
    	    <>
    	      <PongGame />
    	    </>
    	  )}
			{(current_player?.name && (!match?.status || match?.status !== 'CUSTOM') && !current_player.room && !current_player?.state) && (
    	    <div style={{ display: 'flex', flexDirection: 'row' }}>
    	      <div className='list-container'>
    	        <Rooms />
    	        <PlayerList players={players} />
    	      </div>
    	    </div>
    	  )}
    		</>
		) : (
			<Navigate to="/" />
		)}
		</>
  );
};

export default Pong;
