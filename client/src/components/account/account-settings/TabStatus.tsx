// ** React Imports
import React, { useReducer } from 'react'

// ** MUI Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IUser from '../../../types/user.type'
import Box from '@mui/material/Box';

interface TabStatusProps {
	currentUser: IUser | null
}

function createData(
    name: string,
    win: number,
    loses: number,
    media: number,
    plays: number,
  ) {
    return { name, win, loses, media, plays};
  }

const rows = [
    createData('Fulana1', 5, 10, 24, 4.0),
    createData('Fulano', 237, 9.0, 37, 4.3),
    createData('Fulane1', 262, 16.0, 24, 6.0),
    createData('Fulan', 305, 3.7, 67, 4.3),
    createData('Fu2', 356, 16.0, 49, 3.9),
  ];

const TabStatus: React.FC<TabStatusProps> = ({ currentUser }) => {

  const text = "texto";
  const anotherText = "texto";

	return (
        <TableContainer component={Paper}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            '& > :not(style)': {
              m: 1,
              width: 128,
              height: 128,
            },
          }}
        >
          <Paper elevation={3}  style={{padding: '10px', }}>
            <span style={{ color: '#FF0000' }}>Red({text})</span>
            <br />
            <span style={{ color: '#000000' }}>White({anotherText})</span>
          </Paper>
        </Box>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Win</TableCell>
              <TableCell align="right">Loses</TableCell>
              <TableCell align="right">Media</TableCell>
              <TableCell align="right">Plays</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.win}</TableCell>
                <TableCell align="right">{row.loses}</TableCell>
                <TableCell align="right">{row.media}</TableCell>
                <TableCell align="right">{row.plays}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
	);

}


export default TabStatus
