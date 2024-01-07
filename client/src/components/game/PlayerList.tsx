import React from 'react';

interface PlayerListProps {
  players: {
    [key: string]: {
      name: string;
    };
  };
}

const PlayerList: React.FC<PlayerListProps> = (props) => {
  return (
    <div className='list-group'>
      <span className='list-title'>Users</span>
      {Object.keys(props.players).map((key) => (
        <div key={key} className='list-item'>
          {props.players[key].name}
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
