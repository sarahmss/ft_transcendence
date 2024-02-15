import { Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField } from '@mui/material';

import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';

import { DIRECT, GROUP } from '../../../common/constants';
import authService from '../../../services/auth.service';

const roomType = signal(0);
const roomName = signal("");
const password = signal("");
const members = signal([]);
const isPrivate = signal(false);

const RoomCreationComponent = () => {
  useSignals();

  const sendCreationRequest = () => {
    
    console.log(
        roomType.value,
        members.value,
        authService.getIdFromToken(),
        roomName.value,
        isPrivate.value,
        password.value
    );
    // roomService.createRoom(
    //   roomType.value,
    //   members.value,
    //   authService.getIdFromToken(),
    //   roomName.value,
    //   isPrivate.value,
    //   password.value
    // );
  }

  
  return (
    <Box
      component={"form"}
      sx={{
        '& > :not(style)': { m: 1, width: "80%", label:{ marginTop: 0} },
      }}
      >
      <RoomNameAndPassFieldComponent/>
      <SelectComponent/>

      <CheckBoxComponent/>
      <IconButton onClick={sendCreationRequest}>
        Send
      </IconButton>
    </Box>
  );
}

const RoomNameAndPassFieldComponent = () => {
  useSignals();

  const handleRoomNameChange = (event: any) => {
    roomName.value = event.target.value;
  }

  const handlePasswordChange = (event: any) => {
    password.value = event.target.value
  }

  return (
    
    <Box
      sx={{
        '& > :not(style)': { m: 1, width: "100%", label:{ marginTop: 0} },
      }}
    >
      <TextField id="RoomName" label="Room name"
        onChange={handleRoomNameChange}
        variant="standard" />

      {
        roomType.value === DIRECT ?
          (
            <TextField id="Password" label="Password"
              sx={{marginTop: 0}}
              variant="standard"
              value=""
              type='password'
              disabled />
          ) :
          (
            <TextField id="Password" label="Password"
              sx={{marginTop: 0}}
              onChange={handlePasswordChange}
              variant="standard"
              value={password.value}
              type='password' />
          )
      
      }
    </Box>
  )
  
}

const SelectComponent = () => {
  useSignals();

  const handleRoomTypeChange = (event: any) => {
    roomType.value = event.target.value;
    password.value = "";
    isPrivate.value = false;
  }
  
  return (
    <FormControl sx={{ m: 1, minWidth: 80, label: {marginTop: 0}}} required>
      <InputLabel id="roomtype-select">Room Type</InputLabel>
    
        <Select
          labelId="roomtype-select"
          id="roomtype-select"
          value={roomType.value === 0 ? '' : roomType.value}
          onChange = {handleRoomTypeChange}
          label="Room Type"
        >

          <MenuItem key={GROUP} value={GROUP}>
            Group
          </MenuItem>

          <MenuItem key={DIRECT} value={DIRECT}>
            Direct
          </MenuItem>

        </Select>
    </FormControl>
  );
}

const CheckBoxComponent = () => {
  useSignals();

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isPrivate.value = event.target.checked;
  }

  return (
    <Box>
      <FormControl component="fieldset" variant="standard">
        {
          roomType.value === DIRECT ?
          (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPrivate.value}
                  onChange={handleCheckBoxChange}
                  name="Private-Room" />
              }
              label="Private Room"
              disabled
              />
          
          ) : (

            <FormControlLabel
              control={
                <Checkbox
                  checked={isPrivate.value}
                  onChange={handleCheckBoxChange}
                  name="Private-Room" />
              }
              label="Private Room"
              />
          )
        }
      </FormControl>
    </Box>
  );
}

export default RoomCreationComponent;
