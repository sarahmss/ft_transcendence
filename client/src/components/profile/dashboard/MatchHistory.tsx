import React, {useState, useEffect} from 'react';
import {Card,
        CardHeader,
        Typography,
        CardContent,
        Box,
        Avatar,
        Grid,
        Paper} from '@mui/material/';

import MuiDivider, { DividerProps } from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import IUserStats from '../../../types/userStats.type';
import CloseIcon from '@mui/icons-material/Close';
import { DefaultPic } from '../../../common/constants';
import userService from '../../../services/user.service';
import IUser from '../../../types/user.type';

interface DataType {
  gameId: string;
  winnerScore: number;
  loserScore: number;
  gameTime: number;
  winnerId: string;
  loserId: string;
}

interface MatchHistoryProps {
  userStats: IUserStats | null;
  profilePic: string;
  currentUser: IUser | null;
}

const Divider = styled(MuiDivider)<DividerProps>(({ theme }) => ({
  margin: theme.spacing(5, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

interface MatchDisplayProps {
  profilePic: string
  winnerId: string
  looserId: string
  isWinner: boolean
  stats: DataType | null
}
const MatchDisplay: React.FC<MatchDisplayProps> = ({ profilePic,
  winnerId,
  looserId,
  isWinner,
  stats }) => {

  const [OpponentProfilePic, setProfilePic] = useState(DefaultPic);

  const loadOpponentProfilePic = async (userId: string) => {
    try {
      const opponent = await userService.RequestUserProfile(userId);
      const picture = await userService.getProfilePicture(opponent.profilePic, userId);
      setProfilePic(picture);
    } catch (error) {
      console.error('Error loading OpponentProfilePic:', error);
    }
  };

  useEffect(() => {
    const opponentId = isWinner ? looserId : winnerId;
    if (opponentId){
      loadOpponentProfilePic(opponentId);
    }
  }, []);

  return (
    <Paper elevation={3}>
      <Grid container spacing={2} direction="row"  sx={{paddingLeft:"5px"}}>
          <Grid item>
            <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
              <Avatar alt="currentUser" src={profilePic} />
            </Box>
            <Typography  variant="subtitle2" >
              Score {isWinner ? stats?.winnerScore :stats?.loserScore}
            </Typography>            
          </Grid>
          <Grid item>
            <CloseIcon color="secondary"/>
          </Grid>          
          <Grid item>
            <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                <Avatar alt="Opponent" src={OpponentProfilePic} />
            </Box>
            <Typography variant="subtitle2" >
              Score {!isWinner ? stats?.winnerScore :stats?.loserScore}
            </Typography>    
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              Match Time: {stats?.gameTime}
            </Typography>   
          </Grid>
        </Grid>
    </Paper>
    
  );
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ userStats, profilePic, currentUser }) => {
  if (!userStats) return null;
  const { victories, defeats } = userStats;

  return (


    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>

      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Victories'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'>View All</Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />


        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
          {victories && victories.map((victory: DataType) => (
            <Box
              key={victory.gameId}
              sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
              
                <MatchDisplay
                  profilePic={profilePic}
                  winnerId={victory.winnerId} 
                  looserId={victory.loserId}
                  stats={victory}
                  isWinner={victory.winnerId === currentUser?.userId}
                 />
            </Box>
          ))}
        </CardContent>
      </Box>

      <Divider flexItem />

      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Defeats'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
          {defeats && defeats.map((defeat: DataType) => (
            <Box key={defeat.gameId} sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                <MatchDisplay
                  profilePic={profilePic}
                  winnerId={defeat.winnerId} 
                  looserId={defeat.loserId}
                  stats={defeat}
                  isWinner={defeat.winnerId === currentUser?.userId}
                 />
            </Box>
          ))}
        </CardContent>
      </Box>
    </Card>
  );
}

export default MatchHistory;
