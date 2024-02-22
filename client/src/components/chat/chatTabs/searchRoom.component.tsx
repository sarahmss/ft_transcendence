import { Box, Grid, IconButton, List, ListItem, ListItemText, TextField } from "@mui/material";
import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import queryService from "../../../services/chat/query.service";
import roomService from "../../../services/chat/room.service";
import authService from "../../../services/auth.service";
import { chatData } from "../../../contexts/ChatContext";

const queryRes: Signal<any[]> = signal([]);

const SearchRoomComponent = () => {
  const [query, setQuery] = React.useState("");


  const queryChange = (event: any) => {
    setQuery(event.target.value);
  }

  const handleSearch = async () => {

    const room: any[] = await queryService.queryRoom(query);
    if (!room) {
      console.log("Failure fetching rooms");
      return ;
    }

    queryRes.value = room;
  }

  return (
    <Box
      sx={{
        '& > :not(style)': { m: 1, label:{ marginTop: 0} },
      }}
      >
			<Grid container spacing={2}>
				<Grid item xs={10}>
          <TextField id="RoomName" label="Room name"
            value={query}
            sx={{width: "80%"}}
            onChange={queryChange}
            variant="standard" />
          <IconButton onClick={handleSearch}>
            <SearchIcon/>
          </IconButton>

          <ResultComponent />

        </Grid>
      </Grid>
    </Box>
  );
}

const ResultComponent = () => {
  useSignals();

  return (
    <List>
        {
          queryRes.value.map( (room: any) => {
            return (
              <Box key={room.roomId}>
                <RoomResultComponent  roomData={{room}}/>
                <Divider sx={{width: "80%"}}/>
              </Box>
            );
          })
        }
    </List>
  );
}


const RoomResultComponent = ({roomData} : {roomData: any}) => {
  useSignals();

  const room = roomData.room;
  const [password, setPass] = React.useState("");

  const [showPrompt, setPrompt] = React.useState(false);

  const handleJoin = () => {

    roomService.joinRoom(
      room.roomId,
      authService.getIdFromToken(),
      password
    );
    setPass("");
  }

  const togglePrompt = () => {
    setPrompt(!showPrompt);
  }


  const isAlreadyIn: boolean = chatData.value.some(
    (roomData) => roomData.roomId === room.roomId
  );

  return (
    <Box>
      <ListItem
        sx={{minWidth: 200, display: 'flex'}}
      >
        {room.roomName}

        {
          room.protected ?
           (<LockIcon sx={{fontSize: "medium"}}/>) :
            (<span style={{ visibility: 'hidden' }} />)
        }

        {
          isAlreadyIn ?
          (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton disabled>
                <LoginIcon />
              </IconButton>
            </Box>
          ) : (

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {
                room.protected ?
                  (
                    <IconButton onClick={togglePrompt}>
                      <LoginIcon />
                    </IconButton>
              
                  ) : (
                    <IconButton onClick={handleJoin}>
                      <LoginIcon />
                    </IconButton>
                  )
            
              }
            </Box>
          )
        }

      </ListItem>
      {
        showPrompt ?
          (<PasswordField data={{roomId: room.roomId, setPass: setPass, password: password}} />) : 
          (<span style={{ visibility: 'hidden' }} />)
      }
    </Box>
  );
}

const PasswordField = ({data} : {data: any}) => {

  const {roomId, setPass, password} = data;

  const handleChangeText = (event: any) => {
    setPass(event.target.value);
  }

  const handleSendJoinRequest = () => {
    roomService.joinRoom(
      roomId,
      authService.getIdFromToken(),
      password
    );
    
  }

  return (
    <Box>
      <TextField
        label="Password"
        variant="outlined"
        value={password.value}
        onChange={handleChangeText}
        type='password'
      />
      <IconButton sx={{marginTop: "8px"}}
        onClick={handleSendJoinRequest}>
        <ArrowForwardIcon/>
      </IconButton>
    </Box>
  );
}



export default SearchRoomComponent;
