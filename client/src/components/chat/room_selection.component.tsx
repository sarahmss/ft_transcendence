
import { useSignals } from "@preact/signals-react/runtime"
import {
	Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent,
} from "@mui/material";

import { chatData, currentRoom, userLogged } from "../../contexts/ChatContext";




const RoomSelectionComponent = () => {
  useSignals();

  return (
    <Box sx={{bgcolor: 'background.gray'}}>
      { userLogged ? (<EnabledComponent />) : (<DisabledComponent />)}
    </Box>
  );
}

const DisabledComponent = () => {
  return (
    <FormControl sx={{ height: '5%', m: 1, minWidth: 80, width: '75%' }} disabled> 
      <InputLabel id="room-selector">You must login first</InputLabel>
        <Select
          labelId="room-selector"
          id="room-selector"
          value={currentRoom.value}
          label="Room"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

          {chatData.value.rooms.value.map((room: any) => {
            return (<MenuItem value={room.roomId}> room.roomName </MenuItem>);
          })}

        </Select>
    </FormControl>
  );
}

const EnabledComponent = () => {
  
  const handleRoomChange = (event: SelectChangeEvent) => {
    currentRoom.value = event.target.value;
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 80, width: '100%'}} fullWidth required>
      <InputLabel id="room-selector">Choose a room</InputLabel>
        <Select
          labelId="room-selector"
          id="room-selector"
          value={currentRoom.value}
          onChange = {handleRoomChange}
          autoWidth
          label="Room"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

          {chatData.value.rooms.value.map((room: any) => {
            return (<MenuItem value={room.roomId}> room.roomName </MenuItem>);
          })}

        </Select>
    </FormControl>
  );
}


export default RoomSelectionComponent;
