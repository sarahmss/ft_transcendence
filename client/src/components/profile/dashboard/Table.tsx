// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import IUserStats from '../../../types/userStats.type'

// ** Types Imports
type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

interface RowType {
  matches: string;
  name: string;
  victories: string;
  email: string;
  defeats: string;
  status: string;
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
  const rows: RowType[] | undefined = AllUserStats?.map((userStats: IUserStats) => {
    const row: RowType = {
      matches: userStats?.matches || '0',
      status: userStats?.status || 'Offline',
      victories: userStats?.totalGamesWon || '0',
      defeats: userStats?.totalGamesLost || '0',
      name: userStats?.userName || 'user',
      email: userStats?.email || 'user@email',
    } ;

    return row;
  });

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                  </Box>
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
  );
};

export default DashboardTable;
