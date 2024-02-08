// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import IUserStats from '../../../types/user.type'
import IUser from '../../../types/user.type'

import Trophy from './dashboard/Trophy'
import StatisticsCard from './dashboard/StatisticsCard'
import DashboardTable from './dashboard/Table'
import { CardContent } from '@mui/material';
import userService from '../../../services/user.service';


interface TabStatusProps {
	currentUser: IUser | null
}

const TabStatus: React.FC<TabStatusProps> = ({ currentUser }) => {


  const [userStats, setUserStats] = useState<IUserStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStats = await userService.RequestUserStats()
        if (userStats) {
          setUserStats(userStats);
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
            <Grid item xs={12}>
            <DashboardTable />
          </Grid>
        </CardContent>
          
	);

}


export default TabStatus
