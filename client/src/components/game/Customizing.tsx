import React, { useState, ChangeEvent } from 'react';
import { customizeAndPlay } from '../../contexts/GameContext';
import {
  Typography,
  Button,
  Stack,
  Box,
  Radio,
  FormControlLabel
} from '@mui/material';
import './css/game_styles.css';

interface CustomizingProps {}

const Customizing: React.FC<CustomizingProps> = (props) => {
  const [color, setColor] = useState<string>('#000000');
  const [colorPaddle, setColorPaddle] = useState<string>('#111111');
  const [roundedMode, setRoundedMode] = useState<string>('no');
  const [speedMode, setSpeedMode] = useState<string>('no');
  let [alreadyCustomized, setAlreadyCustomized] = useState<Boolean>(false);

  const preCustomizeAndPlay = (e: React.FormEvent) => {
    e.preventDefault();
    setAlreadyCustomized(true);

    const customChoices = {
      backgroundColor: color,
      paddleColor: colorPaddle,
      roundedMode: roundedMode,
      speedMode: speedMode,
    };
    customizeAndPlay(customChoices);

    return false; //pra impedir recarregamento
  };

  const handleRoundedModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoundedMode(e.target.value);
  };

  const handleSpeedModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSpeedMode(e.target.value);
  };

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  return (
    <>
    <Stack sx={{ margin: 'auto', gap:'1.5rem', width: '400px', minWIdth: '250px' }}>
      <Box
        className='flex-center preview'
        sx={{
          backgroundColor: color,
          borderRadius: roundedMode === 'yes' ? '15px' : '0px'
        }}
      >
        <Box
          className='paddle paddle-right'
          sx={{
            backgroundColor: colorPaddle,
            borderRadius: roundedMode === 'yes' ? '15px' : '0px',
            width: '10px',
            height: '50px',
            margin: '285px'
          }}
        ></Box>
        <Box
          className='paddle paddle-left'
          sx={{
            backgroundColor: colorPaddle,
            borderRadius: roundedMode === 'yes' ? '15px' : '0px',
            width: '10px',
            height: '50px',
            margin: '15px'
          }}
        ></Box>
        <Box className='preview-line'></Box>
      </Box>
      <Box display="flex" sx={{ flexDirection:"column", gap: '0.75rem', my: '2rem' }} >
        <Box display="flex" sx={{ gap:'1rem', width: '25rem', my: '1.5rem' }} >
          <Box component="span">Choose the background color:</Box>
          <input
            style={{
              backgroundColor: color,
              borderRadius: '15px',
              cursor: 'pointer',
            }}
            type='color'
            id='backgroundColorPicker'
            value={color}
            onChange={handleColorChange}
          />
        </Box>
        <Box display="flex" alignItems="center" sx={{ gap:'1rem', width: '25rem' }}>
          <Box component="span">Choose paddle's color</Box>
          <input
            style={{
              backgroundColor: colorPaddle,
              borderRadius: '15px',
              cursor: 'pointer',
            }}
            type='color'
            id='paddleColorPicker'
            value={colorPaddle}
            onChange={(e) => setColorPaddle(e.target.value)}
          />
        </Box>
        <Box display="flex" sx={{ gap:'3rem' }}>
          <Box component="span">Rounded Mode</Box>
          <FormControlLabel
            control={
            <Radio
              checked={roundedMode === 'yes'}
              onChange={handleRoundedModeChange}
              value='yes'
              name='roundedMode'
            />
            }
            label='Yes'
          />
          <FormControlLabel
            control={
            <Radio
              name='roundedMode'
              value='no'
              checked={roundedMode === 'no'}
              onChange={handleRoundedModeChange}
            />
            }
            label='No'
            />
        </Box>

        <Box display="flex" sx={{ gap:'3rem' }}>
          <Box component="span">Do you prefer to accelerate the ball?</Box>
          <FormControlLabel
            control={
            <Radio
              name='speedMode'
              value='yes'
              checked={speedMode === 'yes'}
              onChange={handleSpeedModeChange}
            />
            }
            label='Yes'
            />
            <FormControlLabel
              control={
              <Radio
                name='speedMode'
                value='no'
                checked={speedMode === 'no'}
                onChange={handleSpeedModeChange}
              />
              }
              label='No'
              />
        </Box>
        <Box>
        <Button
          disabled={alreadyCustomized === true}
          onClick={preCustomizeAndPlay}
          sx={{ backgroundColor:"#B700cc", color: "#fff" }}
          >
          Customize
        </Button>
      </Box>
      </Box>
    </Stack>
    </>
  );
};

export default Customizing;
