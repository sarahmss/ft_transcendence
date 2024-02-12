import React, {useState, useEffect} from 'react';
import {Card,
        CardHeader,
        Typography,
        CardContent,
        Box,
        Avatar,
        Grid,
        Paper,
        CardMedia,
        styled} from '@mui/material/';

import MuiDivider, { DividerProps } from '@mui/material/Divider';
import IUserStats from '../../../types/userStats.type';
import CloseIcon from '@mui/icons-material/Close';
import { DefaultPic } from '../../../common/constants';
import userService from '../../../services/user.service';
import MatchHistory from '../../../types/matchHistory.type';

import  winner  from '../../../assets/winner.png';
import  loser  from '../../../assets/loser.png';

interface MatchHistoryComponentProps {
  userStats: IUserStats | null;
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
  stats: MatchHistory | null
}
const MatchDisplay: React.FC<MatchDisplayProps> = ({ stats }) => {

  const [winnerPic, setWinnerPic] = useState(DefaultPic);
  const [loserPic, setLoserPic] = useState(DefaultPic);

  const loadAvatars = async (stats: MatchHistory | null) => {
    try {
      if (stats){
        const winnerUrl = stats.winner.profilePicture || DefaultPic;
        const loserUrl = stats.loser.profilePicture || DefaultPic;

        const Pic1 = await userService.getProfilePicture(winnerUrl, stats.winner.userId);
        const Pic2 = await userService.getProfilePicture(loserUrl, stats.loser.userId);

        setWinnerPic(Pic1);
        setLoserPic(Pic2);        
      }
    } catch (error) {
      console.error('Error loading OpponentProfilePic:', error);
    }
  };

  useEffect(() => {
    loadAvatars(stats);
  }, []);

  return (
    <Paper elevation={3}>
      <Grid container spacing={2} direction="row"  sx={{paddingLeft:"5px"}}>
          <Grid item>
            <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
              <Avatar alt="Winner" src={winnerPic} />
            </Box>
            <Typography  variant="subtitle2" >
              {stats?.winner.userName} score {stats?.winnerScore}
            </Typography>            
          </Grid>
          <Grid item>
            <Box sx={{  position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center',}}>
              <CloseIcon />
            </Box>

          </Grid>          
          <Grid item>
            <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                <Avatar alt="Loser" src={loserPic} />
            </Box>
            <Typography variant="subtitle2" >
              {stats?.loser.userName} score {stats?.loserScore}
            </Typography>    
          </Grid>
          <Grid item>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                fontFamily: 'Arial, sans-serif'
              }}
              >
            <Typography variant="subtitle1">
              Match Time {stats?.gameTime}
            </Typography> 
            </Box>
          </Grid>
        </Grid>
    </Paper>
    
  );
}

const MatchHistoryComponent: React.FC<MatchHistoryComponentProps> = ({ userStats }) => {
  if (!userStats) return null;
  const { victories, defeats } = userStats;

  return (

    <Paper elevation={3} >
      <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
      <CardMedia sx={{ objectFit:"cover", height: '9rem'}} image={winner} />
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',}}>
        <CardHeader
            title='Victories'            
            sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
            titleTypographyProps={{
              variant: 'h4',
              sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
            }}
          />
          <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important`}}>
            {victories && victories.map((victory: MatchHistory) => (
              <Box
                key={victory.gameId}
                sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                
                <MatchDisplay
                    stats={victory}
                  />
              </Box>
            ))}
          </CardContent>
        </Box>
        <CardMedia sx={{ objectFit:"cover", height: '9rem'}} image={loser} />
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',}}>              
          <CardHeader
            title='Defeats'
            sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
            titleTypographyProps={{
              variant: 'h4',
              sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
            }}
          />
          <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
            {defeats && defeats.map((defeat: MatchHistory) => (
              <Box key={defeat.gameId} sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                  <MatchDisplay
                    stats={defeat}
                  />
              </Box>
            ))}
          </CardContent>
        </Box>
      </Card>
    </Paper>
  );
}

export default MatchHistoryComponent;
