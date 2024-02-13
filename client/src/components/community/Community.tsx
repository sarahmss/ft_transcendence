// ** React Imports
import React, { useEffect, useState, useReducer  } from 'react';
import { Navigate, useSearchParams} from 'react-router-dom';

// ** MUI Imports
import { Card,
        CardContent,
        CardHeader,
        Grid,
        CardMedia,
        Typography,
        Box } from '@mui/material';

import IUserStats from '../../types/userStats.type';
import DashboardTable from './dashboard/Table';

import userService from '../../services/user.service';
import authService from '../../services/auth.service';
import communityImg  from '../../assets/community.png';
import { reducer } from "../../common/helper";

const Community = () => {
  const [AllUserStats, setAllUserStats] = useState<IUserStats[] | null>(null);
  const [searchParams] = useSearchParams();
	const [redirect, setRedirect]= useReducer(reducer, { redirect: "",});

  const SetUserStats = async () => {
    try {
        const AllUserStats = await userService.RequestAllUserStats();
        if (AllUserStats) {
          setAllUserStats(AllUserStats);
        }
    } catch (error) {
      console.error('Error seting user stats:', error); }
  }

  const SetUserCommunity = async (userId: string) => {
    try {
      await userService.RequestUserProfile(userId).then(
        response =>{
          SetUserStats();
        },
        error => {
          setRedirect({redirect : 'home'});
        }
      );

    } catch (error) {
      console.error('Error SetUserCommunity:', error);
    }
  };

  const fetchData = async () => {
    try {
      const user = await authService.getCurrentUser();
      
      if (user) {
        const userId = searchParams.get('user');
        if (userId){
          SetUserCommunity(userId)
        } else {
          SetUserCommunity(user.userId)
        }       
      } else {
        setRedirect({redirect : 'home'});
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (redirect.redirect) {
    return <Navigate to={redirect.redirect} />;
  }

  return (
    <Card sx={{margin: "50px"}}>
      <CardMedia sx={{ objectFit:"cover",
                        height: '9rem',
                        borderTop: "5px"}} image={communityImg} />

      <CardHeader>
        <Box sx={{
              display: "flex",
              justifyContent:"center"}}>
          <Typography variant='h1'>
            Community 
          </Typography>
        </Box>
        
      </CardHeader>
      <CardContent >
      <Grid container spacing={2}>
        <Grid item sx={{width:"100%"}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DashboardTable AllUserStats={AllUserStats} setRedirect={setRedirect}  />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </CardContent>
    </Card>
  );
};

export default Community;
