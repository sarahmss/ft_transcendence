// ** React Imports
import React, { useReducer } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import IUser from '../../../types/user.type'
import Box from '@mui/material/Box';
import Trophy from './dashboard/Trophy'
import StatisticsCard from './dashboard/StatisticsCard'
import DashboardTable from './dashboard/Table'
import { CardContent } from '@mui/material';


interface TabStatusProps {
	currentUser: IUser | null
}

const TabStatus: React.FC<TabStatusProps> = ({ currentUser }) => {

	return (
        <CardContent>
         <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <Trophy currentUser={currentUser} />
              </Grid>
              <Grid item xs={12} md={8}>
                <StatisticsCard />
              </Grid>
            </Grid>
            <Grid item xs={12}>
            <DashboardTable />
          </Grid>
        </CardContent>
          
	);

}


export default TabStatus
