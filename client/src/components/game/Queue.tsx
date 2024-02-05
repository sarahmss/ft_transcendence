import React, { useEffect } from 'react';
import { execMatch, exitQueue } from '../../contexts/GameContext';

const Queue: React.FC = () => {
//   const { in_waiting, current_player, rooms, match } = useContext(GameContext) as State;

  useEffect(() => {
    execMatch();
  }, []);

  return (
    <>
      <div>
        <h1>Waiting for a game...</h1>
        <button onClick={exitQueue}>Leave queue</button>
      </div>
    </>
  );
};

export default Queue;
