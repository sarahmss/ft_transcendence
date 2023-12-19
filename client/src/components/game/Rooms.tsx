import React, { useContext } from 'react';
import { GameContext, leaveRoom, enterSpectator, State} from '../../contexts/GameContext';


const Rooms: React.FC = () => {
  const { current_player, rooms } = useContext(GameContext) as State;

  return (
    <div className='list-group'>
      <span className='list-title'>
        Open Rooms
      </span>
      {!current_player.room &&
        Object.keys(rooms).map((key) => (
			(rooms[key].player1 && rooms[key].player2) ? (
          <div key={`room_${key}`} className='list-item'>
            {rooms[key].name}
            <button
              onClick={() => enterSpectator(key)}
              disabled={!rooms[key].player1 || !rooms[key].player2}
            >
              Watch Match
            </button>
          </div>)
		  : null
        ))}
    </div>
  );
};

export default Rooms;
