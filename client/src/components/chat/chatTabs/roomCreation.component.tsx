import * as React from 'react';
import roomService from '../../../services/chat/room.service';
import { DIRECT, GROUP } from '../../../common/constants';
import authService from '../../../services/auth.service';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const RoomCreationComponent = () => {

  const [roomName, setRoomName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [roomType, setRoomType] = React.useState(0);
  const [members, setMember] = React.useState([]);
  const [isPrivate, setPrivate] = React.useState(false);

  const handleRoomNameChange = (event: any) => {
    setRoomName(event.target.value);
  }

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  }

  const handleRoomTypeChange = (event: any) => {
    setRoomType(event.target.value);
  }

  const searchUsers = (event: any) => {
  }

  const handleMemberAddAndRemove = (event: any) => {
    console.log(event);
    // setMember([
    //   ...members,
    //   event.target.value
    // ]);
  }

  const handlePrivateStatus = (event: any) => {


  }

  const sendCreationRequest = () => {
    
    roomService.createRoom(
      roomType,
      members,
      authService.getIdFromToken(),
      roomName,
      isPrivate,
      password
    );
  }

  
  return (
    <Box
      component={"form"}
      sx={{
        '& > :not(style)': { m: 1, width: "80%", label:{ marginTop: 0} },
      }}
      >
      <TextField id="RoomName" label="Room name"
        onChange={handleRoomNameChange}
        variant="standard" />

      <TextField id="Password" label="Password"
        sx={{marginTop: 0}}
        onChange={handlePasswordChange}
        variant="standard"
        type='password' />

      <FormControl sx={{ m: 1, minWidth: 80, label: {marginTop: 0}}} required>
        <InputLabel id="roomtype-select">Room Type</InputLabel>
      
          <Select
            labelId="roomtype-select"
            id="roomtype-select"
            value={roomType === 0 ? '' : roomType}
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
     
    </Box>
  );
}

export default RoomCreationComponent;
