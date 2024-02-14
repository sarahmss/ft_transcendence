import { Box, TextField } from "@mui/material";
import { Signal, signal } from "@preact/signals-react";
import React from "react";
import roomService from "../../../services/chat/room.service";


const SearchRoomComponent = () => {
  const [query, setQuery] = React.useState("");

  const queryRes: Signal<any[]> = signal([]);


  const queryChange = (event: any) => {
    setQuery(event.target.value);
    if (event.key === 'Enter') {
      console.log(event);
    }
  }

  //This function will populate the room list
  //Using the signal lib it will dinamically update it
  const getQueryResults = () => {

    // const getRooms: any[] = roomService.togglePrivate;
    // queryRes.value = getRooms;
    
  }

  return (
    <Box
      component={"form"}
      sx={{
        '& > :not(style)': { m: 1, width: "80%", label:{ marginTop: 0} },
      }}
      >
      <TextField id="RoomName" label="Room name"
        value={query}
        onChange={queryChange}
        variant="standard" />
    </Box>
  );
}

export default SearchRoomComponent;
