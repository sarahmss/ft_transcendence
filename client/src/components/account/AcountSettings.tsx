// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined';

// ** Demo Tabs Imports
import TabInfo from './account-settings/TabInfo'
import TabAccount from './account-settings/TabAccount'
import TabSecurity from './account-settings/TabSecurity'
import TabStatus from './account-settings/TabStatus'

import authService from '../../services/auth.service'
import { Navigate } from "react-router-dom";
import IUser from '../../types/user.type'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const AccountSettings = () => {
  // ** State
  const [value, setValue] = useState<string>('account');
  const [redirect, setRedirect] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authService.getCurrentUser();
        console.log("user AcountSettings: ", user);

        if (user) {
          setCurrentUser(user);
        } else {
          setRedirect('home');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  if (redirect === 'home') {
    return <Navigate to={'/'} />;
  }

  return (

	<div className="settings-content">
	<div className="md-layout md-gutter container mt-3">
		<div style={{ margin: '100px 0' }} className="md-layout-item md-layout md-gutter md-alignment-top-center">

    <Card style={{ minWidth: '300px' }} className="md-layout-item md-size-65">
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='account'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountOutline />
                <TabName>Account</TabName>
              </Box>
            }
          />
          <Tab
            value='security'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LockOpenOutline />
                <TabName>Security</TabName>
              </Box>
            }
          />
          <Tab
            value='info'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InformationOutline />
                <TabName>Info</TabName>
              </Box>
            }
          />
          <Tab
            value='status'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MilitaryTechOutlinedIcon />
                <TabName>Status</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='account'>
          {currentUser && <TabAccount currentUser={currentUser}/>}
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='security'>
			{currentUser && <TabSecurity currentUser={currentUser} />}
		</TabPanel>
        <TabPanel sx={{ p: 0 }} value='info'>
          { currentUser && <TabInfo currentUser={currentUser}/>}
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='status'>
            {currentUser && <TabStatus currentUser={currentUser}/>}
        </TabPanel>
      </TabContext>
    </Card>
	</div>
	</div>
	</div>
  )
}

export default AccountSettings
