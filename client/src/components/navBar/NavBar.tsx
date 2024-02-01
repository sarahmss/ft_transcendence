import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import authService from '../../services/auth.service';
import { Link} from 'react-router-dom';

import { DefaultPic } from '../../common/constants';

import {useSelector, useDispatch} from "react-redux";
import {addUser, userLog} from "../../services/reduce";

const pagesLogged = [
	{ label: 'Profile', link: '/profile' },
	{ label: 'Settings', link: '/settings' },
	{ label: 'Logout', link: '/logout' },
];

const pagesUnlogged = [
  { label: 'Login', link: '/login' },
	{ label: 'Signup', link: '/register' },
];

const NavBar: React.FC = () => {
  const [isLogged, setIsLogged] = React.useState(false);
  const [profilePic, setProfilePic] = React.useState('');
  let users = useSelector(userLog);
  

  const fetchData = async () => {
    try {
      //const authTokenQr = authService.getAuthToken();
      const user = await authService.getCurrentUser();
        console.log(user);
        if (user) {
          setIsLogged(true);
          const photoProfile = await authService.getProfilePicture(user.profilePicture);
          const teste = photoProfile instanceof HTMLImageElement ? photoProfile.src : '';
          setProfilePic(teste);
          console.log("http://localhost:5000" + user.profilePicture);
        } else {
          setIsLogged(false);
          setProfilePic(DefaultPic);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
  };

  React.useEffect(() => {
    fetchData();
    console.log("Hello")
  }, [users]);


  // const handleLogoutClick = async () => {
  //   try {
  //     console.log("entrou no try logOut 2");
  //     await authService.logout();
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //   }
  // };
  
  const logout = () => {
    //
	};

  return (
    <AppBar position="static" sx={{ backgroundColor: '#B700cc' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SelfImprovementIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            >
            TRANSCENDENCE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              >
            </IconButton>
          </Box>
          <SelfImprovementIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            >
            TRANSCENDENCE
          </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {isLogged ? (
            pagesLogged.map((page) => (
              <MenuItem key={page.label}>
                    <Link to={page.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">{page.label}</Typography>
                    </Link>
                </MenuItem>
              ))
              ) : (
                pagesUnlogged.map((page) => (
                  <MenuItem key={page.label}>
                  <Link to={page.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography textAlign="center">{page.label}</Typography>
                  </Link>
                </MenuItem>
              ))
              )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Profile Picture">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={profilePic} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
