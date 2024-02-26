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
        Divider} from '@mui/material/';

import IUserStats from '../../../types/userStats.type';
import CloseIcon from '@mui/icons-material/Close';
import { DefaultPic } from '../../../common/constants';
import userService from '../../../services/user.service';
import MatchHistory from '../../../types/matchHistory.type';
import TimerSharpIcon from '@mui/icons-material/TimerSharp';
import  winner  from '../../../assets/winner.png';
import  loser  from '../../../assets/loser.png';

interface MatchHistoryComponentProps {
  userStats: IUserStats | null;
}


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
        <Typography variant="subtitle1"
          sx={{fontFamily: 'monospace',
              display: 'flex',
              justifyContent:'center',
              marginTop:"3px"}}>
          <TimerSharpIcon/> Match Time {stats?.gameTime} s
        </Typography>
        <Divider>
      
      </Divider>

      <Grid container spacing={2} direction="row"  >
          <Grid item sx={{ margin:"5px"}}>
            <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
              <Avatar alt="Winner" src={winnerPic} />
            </Box>
            <Typography  variant="subtitle2" sx={{fontFamily: 'monospace'}}>
            {stats?.winner.userName} score {stats?.winnerScore}
            </Typography>            
          </Grid>

          <Grid item>
            <Box sx={{  position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop:"2.5vh"}}>
              <CloseIcon />
            </Box>
          </Grid>

          <Grid item sx={{ margin:"5px"}}>

            <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                <Avatar alt="Loser" src={loserPic} />
            </Box>
            <Typography variant="subtitle2" sx={{fontFamily: 'monospace'}}>
            {stats?.loser.userName}  score {stats?.loserScore}
            </Typography>    
          </Grid>
        </Grid>
    </Paper>
    
  );
}

const MatchHistoryComponent: React.FC<MatchHistoryComponentProps> = ({ userStats }) => {
  if (!userStats) return null;
  const { victories, defeats } = userStats;

  return (
    <div style={{ display: 'flex', gap: '16px', width: '100%'}}>
    <Paper elevation={3} style={{flex:1}}>
      <CardMedia sx={{ objectFit:"cover", height: '9rem', borderTopLeftRadius: '5px', borderTopRightRadius: '5px'}} image={winner} />
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
                <MatchDisplay stats={victory}/>
              </Box>
            ))}
          </CardContent>
        </Box>
      </Paper>
      <Paper elevation={3} style={{flex:1}}>
        <CardMedia sx={{ objectFit:"cover", height: '9rem', borderTopLeftRadius: '5px', borderTopRightRadius: '5px'}} image={loser} />
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
                  <MatchDisplay stats={defeat} />
              </Box>
            ))}
          </CardContent>
        </Box>
      </Paper>
    </div>
  );
}

export default MatchHistoryComponent;
