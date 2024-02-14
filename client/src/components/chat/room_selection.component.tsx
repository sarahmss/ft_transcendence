
import { useSignals } from "@preact/signals-react/runtime"
import {
	Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent,
} from "@mui/material";

import { chatData, currentRoom, userLogged } from "../../contexts/ChatContext";




const RoomSelectionComponent = () => {
  useSignals();

  return (
    <Box sx={{bgcolor: 'background.gray'}}>
      { userLogged.value ?
        (<EnabledComponent />) : (<DisabledComponent />)}
    </Box>
  );
}

const DisabledComponent = () => {
  return (
    <FormControl sx={{ height: '5%', m: 1, minWidth: 80, width: '75%', label: {marginTop: 0} }} disabled> 
      <InputLabel id="room-selector">Unavailable</InputLabel>
        <Select
          labelId="room-selector"
          id="room-selector"
          defaultValue=''
          label="Room"
        >
          {chatData.value.map((room: any) => {
            return (<MenuItem key={room.roomId} value={room.roomId}> room.roomName </MenuItem>);
          })}

        </Select>
    </FormControl>
  );
}

const EnabledComponent = () => {
  
  const handleRoomChange = (event: SelectChangeEvent<number>) => {
    if (typeof event.target.value === 'number')
      currentRoom.value = event.target.value;
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 80, width: '100%', label: {marginTop: 0}}} fullWidth required>
      <InputLabel id="room-selector">Room</InputLabel>
      
        <Select
          labelId="room-selector"
          id="room-selector"
          value={currentRoom.value === -1 ? '' : currentRoom.value}
          onChange = {handleRoomChange}
          autoWidth
          label="Room"
        >

          {
            chatData.value.map((room: any) => {
              return (
                      <MenuItem key={room.index} value={room.index}>
                        {room.roomName}
                      </MenuItem>
                    );
            })
          }

        </Select>
    </FormControl>
  );
}


export default RoomSelectionComponent;
