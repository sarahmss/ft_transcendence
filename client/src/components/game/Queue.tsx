import React, { useEffect } from 'react';
import { execMatch, exitQueue } from '../../contexts/GameContext';
import {
  Typography,
  Button,
  Stack
} from '@mui/material';

const Queue: React.FC = () => {

  useEffect(() => {
    execMatch();
  }, []);

  return (
    <Stack justifyContent="space-between" alignItems="center" spacing={2} sx={{ margin: 'auto' }}>
      <Typography variant="h3" color="#B700cc">Waiting for a game...</Typography>
      <Button
        onClick={exitQueue}
        sx={{ backgroundColor:"#B700cc", color: "#fff" }}
        >
        Leave Queue
      </Button>
    </Stack>
  );

  // return (
  //   <>
  //     <div>
  //       <h1>Waiting for a game...</h1>
  //       <button onClick={exitQueue}>Leave queue</button>
  //     </div>
  //   </>
  // );
};

export default Queue;
