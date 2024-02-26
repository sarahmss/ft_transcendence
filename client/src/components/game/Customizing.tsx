import React, { useState, ChangeEvent } from 'react';
import { customizeAndPlay } from '../../contexts/GameContext';
import {
  Typography,
  Button,
  Stack,
  Box,
  Radio,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Grid,
  Card} from '@mui/material';
import './css/game_styles.css';
import CustomIllustration from '../../common/Illustrations/CustomIllustration';
interface StepAuxProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  prevActiveStep: number;
}

const StepAux: React.FC<StepAuxProps> = ({ setActiveStep, prevActiveStep }) => {
  const handleNext = () => {
    setActiveStep(prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep - 1);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <div>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ mt: 1, mr: 1, backgroundColor:"#B700cc", color: "#fff" }}
        >
          Next
        </Button>
        <Button
          disabled={prevActiveStep === 0}
          onClick={handleBack}
          sx={{ mt: 1, mr: 1, color:"#B700cc"}} 
        >
          Back
        </Button>
      </div>
    </Box>
  );
};

interface CustomizingProps {}

const Customizing: React.FC<CustomizingProps> = (props) => {
  const [color, setColor] = useState<string>('#000000');
  const [colorPaddle, setColorPaddle] = useState<string>('#111111');
  const [roundedMode, setRoundedMode] = useState<string>('no');
  const [speedMode, setSpeedMode] = useState<string>('no');
  const [alreadyCustomized, setAlreadyCustomized] = useState<Boolean>(false);
  const [activeStep, setActiveStep] = React.useState(0);

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

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
    <Box sx={{display: "flex", justifyContent: "center"}}>
      <Card className="card-container">
        <Stack sx={{ margin: 'auto', gap:'1.5rem', width: '650px', minWIdth: '250px' }}>
          <Box
            className='flex-center preview'
            sx={{
              backgroundColor: color,
              borderRadius: roundedMode === 'yes' ? '15px' : '0px'
            }}
          >
            <Box
              className='paddle'
              sx={{
                backgroundColor: colorPaddle,
                borderRadius: roundedMode === 'yes' ? '15px' : '0px',
                width: '10px',
                height: '50px',
                // margin: '285px'
              }}
            ></Box>
            <Box className='preview-line'></Box>
            <Box
              className='paddle'
              sx={{
                backgroundColor: colorPaddle,
                borderRadius: roundedMode === 'yes' ? '15px' : '0px',
                width: '10px',
                height: '50px',
                // margin: '15px'
              }}
            ></Box>
          </Box>
          <Box display="flex" sx={{ flexDirection:"column", gap: '0.75rem', my: '2rem' }} >
          <Stepper
            activeStep={activeStep}
            orientation="vertical" >
            <Step sx={{ '& .MuiStepIcon-root': { color: "#B700cc", }, }} >
              <StepLabel> Background </StepLabel>
              <StepContent>
              <Grid container spacing={2} direction="row" >
                <Grid item > 
                  <Typography  variant="subtitle2" gutterBottom >Choose background color</Typography>
                </Grid>
                <Grid item> 
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
                </Grid>    
              </Grid>
                  <StepAux setActiveStep={setActiveStep} prevActiveStep={activeStep}/>
              </StepContent>

            </Step>
            <Step sx={{ '& .MuiStepIcon-root': { color: "#B700cc", }, }} >
            <StepLabel> Paddle </StepLabel>
              <StepContent>
              <Grid container spacing={2} direction="row" >
                <Grid item > 
                  <Typography  variant="subtitle2" gutterBottom >Choose paddle's color</Typography>
                </Grid>
                <Grid item> 
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
                  </Grid>    
                  </Grid>
                  <StepAux setActiveStep={setActiveStep} prevActiveStep={activeStep}/>
                </StepContent>
            </Step>
            <Step sx={{ '& .MuiStepIcon-root': { color: "#B700cc", }, }} >
              <StepLabel>Accelerate the ball?</StepLabel>
            <StepContent>
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
                    <StepAux setActiveStep={setActiveStep} prevActiveStep={activeStep}/>
                </StepContent>
            </Step>
          </Stepper>
          {activeStep === 3 && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - you&apos;re finished</Typography>
            <Box display="flex" sx={{ gap:'1rem', justifyContent: 'center' }}>
              <Button
                disabled={alreadyCustomized === true}
                onClick={preCustomizeAndPlay}
                sx={{ backgroundColor:"#B700cc", color: "#fff" }}
                >
                Customize
              </Button>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1, color:"#B700cc"}} >
                Reset
              </Button>
          </Box>
            </Paper>
          )}
          </Box>
        </Stack>
      </Card>
      </Box>
    <CustomIllustration/>
    </>
  );
};

export default Customizing;
