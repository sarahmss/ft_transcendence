import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import IUserStats from '../../types/userStats.type';
import Trophy from './dashboard/Trophy';
import StatisticsCard from './dashboard/StatisticsCard';
import DashboardTable from './dashboard/Table';
import MatchHistoryComponent from './dashboard/MatchHistory';
import userService from '../../services/user.service';
import authService from '../../services/auth.service';
import { DefaultPic, appSocket } from '../../common/constants';

const Profile = () => {
  const [userStats, setUserStats] = useState<IUserStats | null>(null);
  const [FriendsList, setFriendsList] = useState<IUserStats[] | null>(null);
  const [redirect, setRedirect] = useState<string>('');
  const [ownerId, setOwnerId] = useState<string>('');
  const [profilePic, setProfilePic] = useState(DefaultPic);
  const [searchParams] = useSearchParams();

  const loadProfilePic = async (profilePic: string, userId: string) => {
    try {
      const picture = await userService.getProfilePicture(profilePic, userId);
      setProfilePic(picture);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const SetUserStats = async (userId: string, profilePic:string) => {
    try {
        const userStats = await userService.RequestUserStats(userId);
        const FriendsList = await userService.getFriends(userId);
        
        loadProfilePic(profilePic, userId);
        if (userStats) {
          setUserStats(userStats);
        }
        if (FriendsList) {
          setFriendsList(FriendsList);
        }
    } catch (error) {
      console.error('Error seting user stats:', error); }
  }

  const SetUserProfile = async (userId: string) => {
    try {
      await userService.RequestUserProfile(userId).then(
        response =>{
          const userProfile = response.data;
          SetUserStats(userId, userProfile.profilePicture);
        },
        error => {
          setRedirect('error');
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
          SetUserProfile(userId);
          setOwnerId("");          
        } else {
          SetUserProfile(user.userId);
          setOwnerId(user.userId);
        }
      } else {
        setRedirect('error');
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchData();

    if (ownerId !== null){
      appSocket.on('refresh', async () => {
        const FriendsList = await userService.getFriends(ownerId);
        if (FriendsList)
          setFriendsList(FriendsList);
      });      
    }

    return () => {
      appSocket.off(`refresh`);
    };  }, [ownerId]);

  if (redirect === 'error') {
    return <Navigate to={'/error'} />;
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
              <MatchHistoryComponent userStats={userStats}/>
            </Grid>
            {ownerId ? (
              <Grid item xs={12}>
                <DashboardTable FriendsList={FriendsList} />
              </Grid>
            ):
            (
              <></>
            )
          }
          </Grid>
        </Grid>
      </Grid>
      </CardContent>
    </Card>
  );
};

export default Profile;