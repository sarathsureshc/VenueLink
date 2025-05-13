import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EventIcon from '@mui/icons-material/Event';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        Profile
      </MenuItem>
      {user?.role === 'event_manager' && (
        <MenuItem onClick={() => { navigate('/my-events'); handleMenuClose(); }}>
          My Events
        </MenuItem>
      )}
      {user?.role === 'admin' && (
        <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
          Admin Dashboard
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(mobileAnchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/events'); handleMenuClose(); }}>
        Events
      </MenuItem>
      {user ? (
        [
          <MenuItem key="profile" onClick={() => { navigate('/profile'); handleMenuClose(); }}>
            Profile
          </MenuItem>,
          user.role === 'event_manager' && (
            <MenuItem key="my-events" onClick={() => { navigate('/my-events'); handleMenuClose(); }}>
              My Events
            </MenuItem>
          ),
          user.role === 'admin' && (
            <MenuItem key="admin" onClick={() => { navigate('/admin'); handleMenuClose(); }}>
              Admin Dashboard
            </MenuItem>
          ),
          <MenuItem key="logout" onClick={handleLogout}>
            Logout
          </MenuItem>,
        ]
      ) : (
        [
          <MenuItem key="login" onClick={() => { navigate('/login'); handleMenuClose(); }}>
            Login
          </MenuItem>,
          <MenuItem key="register" onClick={() => { navigate('/register'); handleMenuClose(); }}>
            Register
          </MenuItem>,
        ]
      )}
    </Menu>
  );

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
          onClick={handleMobileMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <EventIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            EventBooking
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button color="inherit" component={Link} to="/events">
            Events
          </Button>
          {user ? (
            <>
              {user.role === 'event_manager' && (
                <Button color="inherit" component={Link} to="/my-events">
                  My Events
                </Button>
              )}
              {user.role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin
                </Button>
              )}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                {user.avatar ? (
                  <Avatar alt={user.name} src={user.avatar} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      {renderMobileMenu}
      {renderMenu}
    </AppBar>
  );
};

export default Navbar;