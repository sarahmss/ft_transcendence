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


import { Paper } from '@mui/material';
import { DefaultPic, FrontLink } from '../../../common/constants';
import userService from '../../../services/user.service';
import IUserStats from '../../../types/userStats.type';
// ** Types Imports
type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

interface RowType {
  matches: string;
  name: string;
  victories: string;
  email: string;
  defeats: string;
  status: string;
  picture: string;
  link: string;
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor;
  };
}

const statusObj: StatusObj = {
  Online: { color: 'success' },
  Offline: { color: 'error' },
  Playing: { color: 'info' },
};

interface DashboardTableProps {
  FriendsList: IUserStats[] | null;
}

const DashboardTable: React.FC<DashboardTableProps> = ({ FriendsList }) => {

  const [rows, setRows] = useState<RowType[]>([]);
  
  useEffect(() => {
    if (FriendsList) {
      const fetchFriends = async () => {
        const updatedRows: RowType[] = [];
        for (const friend of FriendsList) {
          try {
            let profilePic = friend.profilePicture || DefaultPic;
            profilePic = await userService.getProfilePicture(profilePic, friend.userId);
            const row: RowType = {
              matches: friend.matches || '0',
              picture: profilePic || DefaultPic,
              status: friend.status || 'Offline',
              victories: friend.totalGamesWon || '0',
              defeats: friend.totalGamesLost || '0',
              name: friend.userName || 'user',
              email: friend.email || 'user@email',
              link: FrontLink + `/profile?user=${friend.userId}`
            };
            updatedRows.push(row);
            console.log(row.link);

          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
        setRows(updatedRows);
      };
      fetchFriends();
    }
  }, [FriendsList]);

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
                  <TableCell>Status</TableCell>
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
                        label={row.status}
                        color={statusObj[row.status]?.color || 'error'} // Se o status não for encontrado em statusObj, define como 'error'
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
