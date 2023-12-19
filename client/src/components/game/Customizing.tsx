import React, { useState, ChangeEvent } from 'react';
import { customizeAndPlay } from '../../contexts/GameContext';

interface CustomizingProps {}

const Customizing: React.FC<CustomizingProps> = (props) => {
  const [color, setColor] = useState<string>('#000000');
  const [colorPaddle, setColorPaddle] = useState<string>('#111111');
  const [roundedMode, setRoundedMode] = useState<string>('no');
  const [speedMode, setSpeedMode] = useState<string>('no');

  const preCustomizeAndPlay = (e: React.FormEvent) => {
    e.preventDefault();

    const customChoices = {
      backgroundColor: color,
      paddleColor: colorPaddle,
      roundedMode: roundedMode,
      speedMode: speedMode,
    };
    customizeAndPlay(customChoices);
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
    <div className='customContainer'>
      <div>
        <button className='customBtn' onClick={preCustomizeAndPlay}>
          Customize
        </button>
      </div>
      <div
        className='preview'
        style={{
          backgroundColor: color,
          borderRadius: roundedMode === 'yes' ? '15px' : '0px',
        }}
      >
        <div
          className='paddle paddle-right'
          style={{
            backgroundColor: colorPaddle,
            borderRadius: roundedMode === 'yes' ? '15px' : '0px',
          }}
        ></div>
        <div
          className='paddle paddle-left'
          style={{
            backgroundColor: colorPaddle,
            borderRadius: roundedMode === 'yes' ? '15px' : '0px',
          }}
        ></div>
        <div className='preview-line'></div>
      </div>
      <div className='container' style={{ width: '25rem' }}>
        <span>Choose the background color:</span>
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
      </div>
      <div className='customPaddle' style={{ width: '25rem' }}>
        <span>Choose paddle's color</span>
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
      </div>
      <div className='customCircle'>
        <span>Rounded Mode</span>
        <label>
          <input
            type='radio'
            name='roundedMode'
            value='yes'
            checked={roundedMode === 'yes'}
            onChange={handleRoundedModeChange}
          />
          Yep, I accept
        </label>
        <label>
          <input
            type='radio'
            name='roundedMode'
            value='no'
            checked={roundedMode === 'no'}
            onChange={handleRoundedModeChange}
          />
          No, thanks
        </label>
      </div>

      <div className='speedCustom'>
        <span>Do you prefer to accelerate the ball?</span>
        <label>
          <input
            type='radio'
            name='speedMode'
            value='yes'
            checked={speedMode === 'yes'}
            onChange={handleSpeedModeChange}
          />
          Yep, run Forest!
        </label>
        <label>
          <input
            type='radio'
            name='speedMode'
            value='no'
            checked={speedMode === 'no'}
            onChange={handleSpeedModeChange}
          />
          No, patience is virtue too!
        </label>
      </div>
    </div>
  );
};

export default Customizing;
