// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import IUserStats from '../../../types/userStats.type'
import IUser from '../../../types/user.type'

import Trophy from './dashboard/Trophy'
import StatisticsCard from './dashboard/StatisticsCard'
import DashboardTable from './dashboard/Table'
import MatchHistory from './dashboard/MatchHistory'

import { CardContent } from '@mui/material';
import userService from '../../../services/user.service';


interface TabStatusProps {
	currentUser: IUser | null
}

const TabStatus: React.FC<TabStatusProps> = ({ currentUser }) => {

  const [userStats, setUserStats] = useState<IUserStats | null>(null);
  const [AllUserStats, setAllUserStats] = useState<IUserStats[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStats = await userService.RequestUserStats()
        const AllUserStats = await userService.RequestAllUserStats()

        if (userStats) {
          setUserStats(userStats);
        } if (userStats) {
          setAllUserStats(AllUserStats);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchData();
  }, []);

	return (
        <CardContent>
         <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <Trophy userStats={userStats} />
              </Grid>
              <Grid item xs={12} md={8}>
                <StatisticsCard userStats={userStats} />
              </Grid>
            </Grid>
            <Grid item xs={15}>
              <MatchHistory />
            </Grid>
            <Grid item xs={12}>
              <DashboardTable AllUserStats={AllUserStats}/>
            </Grid>
        </CardContent>
          
	);

}


export default TabStatus
