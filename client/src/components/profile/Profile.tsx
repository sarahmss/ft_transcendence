// ** React Imports
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// ** MUI Imports
import { Card, CardContent, CardHeader, Grid } from '@mui/material';

import IUserStats from '../../types/userStats.type';

import Trophy from './dashboard/Trophy';
import StatisticsCard from './dashboard/StatisticsCard';
import DashboardTable from './dashboard/Table';
import MatchHistoryComponent from './dashboard/MatchHistory';

import userService from '../../services/user.service';
import authService from '../../services/auth.service';
import IUser from '../../types/user.type';
import { DefaultPic } from '../../common/constants';

const Profile = () => {
  const [userStats, setUserStats] = useState<IUserStats | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const [AllUserStats, setAllUserStats] = useState<IUserStats[] | null>(null);
  const [redirect, setRedirect] = useState<string>('');

  const [profilePic, setProfilePic] = useState(DefaultPic);

  const loadProfilePic = async (profilePic: string, userId: string) => {
    try {
      const picture = await userService.getProfilePicture(profilePic, userId);
      setProfilePic(picture);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const userStats = await userService.RequestUserStats();
        const AllUserStats = await userService.RequestAllUserStats();
        
        setCurrentUser(user);
        loadProfilePic(user.profilePicture, user.userId);
        if (userStats) {
          setUserStats(userStats);
        }
        if (AllUserStats) {
          setAllUserStats(AllUserStats);
        }
      } else {
        setRedirect('home');
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (redirect === 'home') {
    return <Navigate to={'/'} />;
  }

  return (
    <Card>
      <CardHeader>

      </CardHeader>
      <CardContent >
      <Grid container spacing={2}>

        <Grid item sx={{width:"100%"}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Trophy userStats={userStats} />
            </Grid>
            <Grid item xs={12} md={8}>
              <StatisticsCard userStats={userStats} profilePic={profilePic} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item sx={{width:"100%"}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DashboardTable AllUserStats={AllUserStats} />
            </Grid>
            <Grid item xs={12}>
              <MatchHistoryComponent userStats={userStats}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </CardContent>
    </Card>
  );
};

export default Profile;
