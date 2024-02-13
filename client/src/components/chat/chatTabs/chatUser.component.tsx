import { Box, Avatar, Icon, IconButton, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import StarIcon from '@mui/icons-material/Star';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';

import { User, privilegedInRoom } from "../../../contexts/ChatContext";


const ChatUser = ({user}:{user: User}) => {

  return (

    <ListItem
      sx={{ minWidth: 375 }}
    >

      {
        (privilegedInRoom.admin.value || privilegedInRoom.owner.value) ?
        (
          <Box>
            <IconButton sx={{justifyContent: 'flex-end'}} aria-label="Ban">
              <BlockIcon/>
            </IconButton>

            <IconButton sx={{justifyContent: 'flex-end'}} aria-label="Kick">
              <GroupRemoveIcon/>
            </IconButton>
          </Box>
        ) : (
          <span style={{ visibility: 'hidden' }} />  
        )
      }

      <IconButton sx={{justifyContent: 'flex-end'}} aria-label="Blacklist">
        <DeleteIcon/>
      </IconButton>

      <ListItemAvatar>
        <Avatar src={user.profileImage}/>
      </ListItemAvatar>

      <ListItemText
        primary={user.userName}
        secondary={user.admin ? "admin" : "" }
      />

      <Icon sx={{height: '2em', justifyContent: 'flex-end'}} aria-labe="owner">
        {user.owner ? (<StarIcon/>) : (<span style={{ visibility: 'hidden' }} />)}
      </Icon>

    </ListItem>
  );
}

export default ChatUser;
