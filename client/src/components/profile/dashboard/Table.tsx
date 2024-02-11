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
  AllUserStats: IUserStats[] | null;
}

const DashboardTable: React.FC<DashboardTableProps> = ({ AllUserStats }) => {

  const [rows, setRows] = useState<RowType[]>([]);
  
  useEffect(() => {
    if (AllUserStats) {
      const fetchUserStats = async () => {
        const updatedRows: RowType[] = [];
        for (const userStats of AllUserStats) {
          try {
            let profilePic = userStats.profilePicture || DefaultPic;
            profilePic = await userService.getProfilePicture(profilePic, userStats.userId);
            const row: RowType = {
              matches: userStats.matches || '0',
              picture: profilePic || DefaultPic,
              status: userStats.status || 'Offline',
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
