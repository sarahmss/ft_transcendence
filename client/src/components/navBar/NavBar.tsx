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
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { Link} from 'react-router-dom';


import { DefaultPic } from '../../common/constants';

import {useSelector} from "react-redux";
import {userLog} from "../../services/reduce";
import userService from '../../services/user.service';



const pagesLogged = [
  { label: 'Logout', link: '/logout' },
	{ label: 'Profile', link: '/profile' },
	{ label: 'Account', link: '/settings' },
  { label: 'Game', link: '/game' },
  { label: 'Community', link: '/community' },
];

const pagesUnlogged = [
  { label: 'Login', link: '/login' },
	{ label: 'Signup', link: '/register' },
];

const NavBar: React.FC = () => {
  const [isLogged, setIsLogged] = React.useState(false);
  const [profilePic, setProfilePic] = React.useState('');
  const [userName, setUserName] = React.useState('');

  let users = useSelector(userLog);


  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const fetchData = async () => {
    try {
      const user = await authService.getCurrentUser();
        if (user) {
          setIsLogged(true);
          setUserName(user.userName)
          const picture = await userService.getProfilePicture(user.profilePicture, user.userId);
			    setProfilePic(picture);
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
  }, );

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
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {isLogged ? (
              pagesLogged.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <Link to={page.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography textAlign="center">{page.label}</Typography>
                  </Link>
                </MenuItem>
              ))
            ) : (
              pagesUnlogged.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <Link to={page.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography textAlign="center">{page.label}</Typography>
                  </Link>
                </MenuItem>
              ))
            )}
          </Menu>
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
          <Box sx={{ flexGrow: 0}}>
            <Tooltip title="Profile Picture">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
               <Typography color='white'> {userName} </Typography>  <Avatar alt="Remy Sharp" src={profilePic} />
              </IconButton>
            </Tooltip>
                      <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
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
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
