import { Box, TextField } from "@mui/material";
import React from "react";


const SearchRoomComponent = () => {
  const [query, setQuery] = React.useState("");
  const [queryRes, setRes] = React.useState([]);

  const queryChange = (event: any) => {
    setQuery(event.target.value);
    if (event.key === 'Enter') {
      console.log(event);
    }
  }

  const keyBoardPress = (event: any) => {
    
    if (event.key === 'Enter')
      console.log(event);

  }

  return (
    <Box
      component={"form"}
      sx={{
        '& > :not(style)': { m: 1, width: "80%", label:{ marginTop: 0} },
      }}
      >
      <TextField id="RoomName" label="Room name"
        onKeyDown={keyBoardPress}
        onChange={queryChange}
        variant="standard" />
    </Box>
  );
}

export default SearchRoomComponent;
