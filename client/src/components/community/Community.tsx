// ** React Imports
import React, { useEffect, useState, useReducer  } from 'react';
import { Navigate, useSearchParams} from 'react-router-dom';

// ** MUI Imports
import { Card, CardContent, CardHeader, Grid, CardMedia } from '@mui/material';

import IUserStats from '../../types/userStats.type';
import DashboardTable from './dashboard/Table';

import userService from '../../services/user.service';
import authService from '../../services/auth.service';
import communityImg  from '../../assets/community.png';
import { reducer } from "../../common/helper";

const Community = () => {
  const [AllUserStats, setAllUserStats] = useState<IUserStats[] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
	const [redirect, setRedirect]= useReducer(reducer, { redirect: "",});

  const SetUserStats = async (userId: string, ProfilePic:string) => {
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
          const userCommunity = response.data;
          SetUserStats(userId, userCommunity.ProfilePicture);
        },
        error => {
          setRedirect({redirect : 'home'});
        }
      );

    } catch (error) {
      console.error('Error fetching user data:', error);
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
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <Card>
      <CardMedia sx={{ objectFit:"cover",
                        height: '9rem',
                        borderTop: "5px"}} image={communityImg} />

      <CardHeader>

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
