import React, { useEffect, useState  } from 'react';


// ** MUI Imports
import{ Box, 
        Card, 
        Chip, 
        Table,
        TableRow,
        TableHead,
        TableBody,
        TableCell,
        Typography,
        TableContainer,
        Avatar,
        Link} from '@mui/material';


import IUserStats from '../../../types/userStats.type'
import { Paper } from '@mui/material';
import { DefaultPic, FrontLink } from '../../../common/constants';
import userService from '../../../services/user.service';

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import OutboxIcon from '@mui/icons-material/Outbox';
// ** Types Imports
type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
type Icons = typeof GroupIcon;


interface RowType {
  matches: string;
  name: string;
  victories: string;
  email: string;
  defeats: string;
  friendship: any;
  picture: string;
  link: string;
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor;
    icon: Icons;
  };
}

const statusObj: StatusObj = {
  AddFriend: { color: 'success', icon: GroupAddIcon},
  RequestSent: { color: 'info', icon: OutboxIcon },
  AcceptRequest: { color: 'success',  icon: GroupAddIcon},
  DenyRequest: { color: 'error', icon: GroupRemoveIcon },
  RemoveFriend: { color: 'error', icon: GroupRemoveIcon },
  Friends: { color: 'secondary', icon: GroupIcon },
};

interface DashboardTableProps {
  AllUserStats: IUserStats[] | null;
  setRedirect: React.Dispatch<React.SetStateAction<{ redirect: string }>>;
}

const DashboardTable: React.FC<DashboardTableProps> = ({ AllUserStats, setRedirect }) => {

  const [rows, setRows] = useState<RowType[]>([]);
  
  const getFriendship = async (friendId: string) => {
    try {
      await userService.getFriendship(friendId).then(
        response =>{
          return response.data.status;
        },
        error => {
          setRedirect({redirect: "error"});
        }
      );
      return ("AddFriend");
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    if (AllUserStats) {      
      const fetchUserStats = async () => {
        const updatedRows: RowType[] = [];
        for (const userStats of AllUserStats) {
          try {
            let profilePic = userStats.profilePicture || DefaultPic;
            profilePic = await userService.getProfilePicture(profilePic, userStats.userId);
            const friends = getFriendship(userStats.userId);
            const row: RowType = {
              matches: userStats.matches || '0',
              picture: profilePic || DefaultPic,
              friendship: friends,
              victories: userStats.totalGamesWon || '0',
              defeats: userStats.totalGamesLost || '0',
              name: userStats.userName || 'user',
              email: userStats.email || 'user@email',
              link: FrontLink + `/profile?user=${userStats.userId}`
            };
            updatedRows.push(row);
            console.log(row.link);

          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
        setRows(updatedRows);
      };
      fetchUserStats();
    }
  }, [AllUserStats]);

  return (
    <Paper elevation={3}>
      <Card >
          <TableContainer>
            <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Matches</TableCell>
                  <TableCell>Victories</TableCell>
                  <TableCell>Defeats</TableCell>
                  <TableCell>FriendShip</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row: RowType) => (
                  <TableRow hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                    <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                      <Link href={row.link}>
                        <Avatar alt="profile" src={row.picture} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                        </Box>                      
                      </Link>
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.matches}</TableCell>
                    <TableCell>{row.victories}</TableCell>
                    <TableCell>{row.defeats}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.friendship}
                        color={statusObj[row.friendship]?.color || 'error'} // Se o status não for encontrado em statusObj, define como 'error'
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                          '& .MuiChip-label': { fontWeight: 500 },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      </Card>
    </Paper>
  
  );
};

export default DashboardTable;
