import { Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField } from '@mui/material';

import { Signal, signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { DIRECT, GROUP } from '../../../common/constants';
import authService from '../../../services/auth.service';
import React from 'react';
import queryService from '../../../services/chat/query.service';
import roomService from '../../../services/chat/room.service';

const roomType = signal(0);
const roomName = signal("");
const members: Signal<string[]> = signal([]);

const password = signal("");
const isPrivate = signal(false);

const errorState = {
                      roomName: signal(false),
                      roomType: signal(false),
                      members: signal(false)
                    };

const RoomCreationComponent = () => {
  useSignals();

  const checkData = (): boolean => {

    var flag: boolean = false;

    if (roomType.value === 0) {
      errorState.roomType.value = true;
      flag = true;
    }

    if (roomName.value === "" && roomType.value === GROUP) {
      errorState.roomName.value = true;
      flag = true;
    }

    if ((members.value.length !== 1 && roomType.value === DIRECT) ||
      (members.value.length === 0 && roomType.value === GROUP)
    ) {
      errorState.members.value = true;
      flag = true;
    }

    if (flag)
      return true;
    return false;
  }

  const resetState = () => {
    
    roomType.value = 0;
    members.value = [];
    roomName.value = "";
    password.value = "";
    isPrivate.value = false;
    
    errorState.roomType.value = false;
    errorState.roomName.value = false;
    errorState.members.value = false;
  }

  const sendCreationRequest = () => {

    if (checkData())
      return;

    const ownerId = authService.getIdFromToken();

    members.value = [
      ...members.value,
      ownerId
    ];

    try {
      roomService.createRoom(
        roomType.value,
        members.value,
        ownerId,
        roomName.value,
        isPrivate.value,
        password.value
        );
        alert(`${roomName.value} room created !!`);
    } catch (error) {
        alert(`Unable to create ${roomName.value}: ${error}`);
    }

    resetState();
  }

  
  return (
    <Box
      component={"form"}
      sx={{
        '& > :not(style)': { m: 1, width: "80%", label:{ marginTop: 0} },
      }}
      >
      <SelectComponent/>
      <RoomNameAndPassFieldComponent/>
      <CheckBoxComponent/>
      <AddUserMemberListComponent/>
  		<Button
  			variant="contained"
  			onClick={sendCreationRequest}
  			sx={{backgroundColor:"#B700cc"}}
  		>
  			<b>Create</b>
  		</Button>
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
      {
        roomType.value === GROUP ? (
          <Box 
            sx={{
              '& > :not(style)': { marginTop: 1, width: "100%", label:{ marginTop: 0} },
            }}
          >
            <TextField id="RoomName" label="Room name"
              onChange={handleRoomNameChange}
              value={roomName.value}
              variant="standard" />
            {
              errorState.roomName.value ? (

                  <FormHelperText error>
                    This field cannot be left empty
                  </FormHelperText>
  
                ) : (

                  <span style={{visibility: 'hidden'}}/>
                )
            }
          </Box>
        
        ) : (
            <TextField id="RoomName" label="Room name"
              disabled
              onChange={handleRoomNameChange}
              value=""
              variant="standard" />
        )
      }

      {
        roomType.value === DIRECT ?
          (
            <>
              <TextField id="RoomName" label="Room name"
                value=""
                variant="standard"
                disabled />
            
              <TextField id="Password" label="Password"
                sx={{marginTop: 0}}
                variant="standard"
                value=""
                type='password'
                disabled />
            </>
            
          ) :
          (
            <>              
              <TextField id="RoomName" label="Room name"
                onChange={handleRoomNameChange}
                value={roomName.value}
                variant="standard" />

              <TextField id="Password" label="Password"
              sx={{marginTop: 0}}
              onChange={handlePasswordChange}
              variant="standard"
              value={password.value}
              type='password' />
            </>
            
           
          )
      
      }
    </Box>
  )
  
}

const SelectComponent = () => {
  useSignals();

  const handleRoomTypeChange = (event: any) => {
    roomType.value = event.target.value;
    if (roomType.value === DIRECT) {
      password.value = "";
      roomName.value = "Direct";
      isPrivate.value = false;
    }  else {
      roomName.value = "";
    }
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
      {
        errorState.roomType.value ? (
            <FormHelperText error>
              You must select the type of the room you want to create
            </FormHelperText>
          ) : (
            <span style={{visibility: 'hidden'}}/>
          )
      }
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

const queryRes: Signal<any[]> = signal([]);

const AddUserMemberListComponent = () => {
  useSignals();

  const [query, setQuery] = React.useState("");

  const handleQueryChange = (event: any) => {
    setQuery(event.target.value);
  }

  const handleUserQuery = async () => {
    const currId = authService.getIdFromToken();

    const users: any[] = await queryService.queryUser(query);

    if (!users) {
      console.log('User query failure');
      return ;
    }


    queryRes.value = users.filter(
      (user) => user.userId !== currId);
  }

  return (
    <Box>
      <TextField id="UserQuery"
        label="User query"
        onChange={handleQueryChange}
        value={query}
        variant="standard" />

      <IconButton sx={{marginTop: "13px"}} onClick={handleUserQuery}>
        <SearchIcon/>
      </IconButton>
      
      <Box 
        sx={{
          backgroundColor: "#dbdbdb",
          minHeight: 130,
          overflowY: "auto",
          maxHeight: 130 }}
      >

        <FormControl
          required
          component="fieldset"
          id='userQuery'
          sx={{ m: 3 }}
          variant="standard"
        >
            <FormGroup>
            {
              queryRes.value.map((user: any) => {
                  return (
                    <FormControlLabel
                      control={
                        <MemberAddRemoveComponent user={user}/>
                      }
                      key={user.userId}
                      label={user.userName}
                    />
                  );
              })
            
            }
            </FormGroup>
        </FormControl>
      </Box>
      {
        errorState.members.value ?
        (<FormHelperText error >You should choose the appropriate amount of members for the room choosen</FormHelperText>) :
        (<span style={{ visibility: 'hidden' }} />)
      }
    </Box>
  );
}

const MemberAddRemoveComponent = ({user} : {user: any}) => {

  useSignals();
  
  const addMember = (event: any) => {
    event.preventDefault();

    members.value = [
      ...members.value,
      user.userId
    ]
  }

  const removeMember = (event: any) => {
    event.preventDefault();

    members.value = members.value.filter((userId: string) =>
      userId !== user.userId
    );
  }

  return (
    <Box>
      {
        members.value.some((userId) => userId === user.userId ) ? (

          <IconButton
            onClick={removeMember}
            name={user.userName}
            value={user.userId}>

            <PersonRemoveIcon/>

          </IconButton>
        ) : (

          <IconButton
            onClick={addMember}
            name={user.userName}
            value={user.userId}>

            <PersonAddIcon/>

          </IconButton>
        )
      }
    </Box>
  );
}



export default RoomCreationComponent;
