import React, { useEffect } from 'react';
import { execMatch, exitQueue } from '../../contexts/GameContext';
import {
  Typography,
  Button,
  Stack,
  Box,
  CircularProgress,
  Grid
} from '@mui/material';
import PlayingIllustration from '../../common/Illustrations/PlayingIllustration';

const Queue: React.FC = () => {

  useEffect(() => {
    execMatch();
  }, []);

  return (
    <Stack justifyContent="space-between" alignItems="center" spacing={2} sx={{ margin: 'auto' }}>

    <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'Arial, sans-serif'
        }}
    >
        <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
							<Grid item > 
                <Typography variant="h3" color="#B700cc" >Waiting for a game...</Typography>
							</Grid>
							<Grid item > 
                <CircularProgress color="secondary" variant="indeterminate" />
							</Grid>
							<Grid item > 
                  <Button onClick={exitQueue} sx={{ backgroundColor:"#B700cc", color: "#fff" }}>
                    Leave Queue  
                </Button>
							</Grid>
					</Grid>
		    <PlayingIllustration />
      </Box>
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
