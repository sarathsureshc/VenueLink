import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  useMediaQuery,
  useTheme,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EventIcon from '@mui/icons-material/Event';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      MenuListProps={{
        'aria-labelledby': 'user-menu-button',
      }}
    >
      <MenuItem 
        onClick={() => { navigate('/profile'); handleMenuClose(); }}
        selected={isActive('/profile')}
      >
        Profile
      </MenuItem>
      {user?.role === 'event_manager' && (
        <MenuItem 
          onClick={() => { navigate('/my-events'); handleMenuClose(); }}
          selected={isActive('/my-events')}
        >
          My Events
        </MenuItem>
      )}
      {user?.role === 'admin' && (
        <MenuItem 
          onClick={() => { navigate('/admin'); handleMenuClose(); }}
          selected={isActive('/admin')}
        >
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
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(mobileAnchorEl)}
      onClose={handleMenuClose}
      MenuListProps={{
        'aria-labelledby': 'mobile-menu-button',
      }}
    >
      <MenuItem 
        onClick={() => { navigate('/events'); handleMenuClose(); }}
        selected={isActive('/events')}
      >
        Events
      </MenuItem>
      {user ? (
        <>
          <MenuItem 
            key="profile" 
            onClick={() => { navigate('/profile'); handleMenuClose(); }}
            selected={isActive('/profile')}
          >
            Profile
          </MenuItem>
          {user.role === 'event_manager' && (
            <MenuItem 
              key="my-events" 
              onClick={() => { navigate('/my-events'); handleMenuClose(); }}
              selected={isActive('/my-events')}
            >
              My Events
            </MenuItem>
          )}
          {user.role === 'admin' && (
            <MenuItem 
              key="admin" 
              onClick={() => { navigate('/admin'); handleMenuClose(); }}
              selected={isActive('/admin')}
            >
              Admin Dashboard
            </MenuItem>
          )}
          <MenuItem key="logout" onClick={handleLogout}>
            Logout
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem 
            key="login" 
            onClick={() => { navigate('/login'); handleMenuClose(); }}
            selected={isActive('/login')}
          >
            Login
          </MenuItem>
          <MenuItem 
            key="register" 
            onClick={() => { navigate('/register'); handleMenuClose(); }}
            selected={isActive('/register')}
          >
            Register
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        boxShadow: 'none', 
        bgcolor: 'background.paper',
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ maxWidth: 'lg', mx: 'auto', width: '100%', py: 1 }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open menu"
          id="mobile-menu-button"
          aria-haspopup="true"
          aria-controls="mobile-menu"
          aria-expanded={mobileAnchorEl ? 'true' : undefined}
          sx={{ 
            mr: 2, 
            display: { md: 'none' }, 
            color: 'text.primary' 
          }}
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
          aria-label="Go to homepage"
        >
          <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary'
            }}
          >
            EventBooking
          </Typography>
        </Box>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/events"
            sx={{ 
              color: isActive('/events') ? 'primary.main' : 'text.primary',
              fontWeight: 600,
              borderBottom: isActive('/events') ? '2px solid' : 'none',
              borderColor: 'primary.main'
            }}
          >
            Events
          </Button>
          
          {user ? (
            <>
              {user.role === 'event_manager' && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/my-events"
                  sx={{ 
                    color: isActive('/my-events') ? 'primary.main' : 'text.primary',
                    fontWeight: 600,
                    borderBottom: isActive('/my-events') ? '2px solid' : 'none',
                    borderColor: 'primary.main'
                  }}
                >
                  My Events
                </Button>
              )}
              
              {user.role === 'admin' && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/admin"
                  sx={{ 
                    color: isActive('/admin') ? 'primary.main' : 'text.primary',
                    fontWeight: 600,
                    borderBottom: isActive('/admin') ? '2px solid' : 'none',
                    borderColor: 'primary.main'
                  }}
                >
                  Admin
                </Button>
              )}
              
              <IconButton
                size="large"
                aria-label="account of current user"
                id="user-menu-button"
                aria-haspopup="true"
                aria-controls="user-menu"
                aria-expanded={anchorEl ? 'true' : undefined}
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ color: 'text.primary' }}
              >
                {user.avatar ? (
                  <Badge overlap="circular" variant="dot" color="success">
                    <Avatar 
                      alt={user.name} 
                      src={user.avatar} 
                      sx={{ width: 32, height: 32 }}
                      onError={(e) => {
                        e.target.src = ''; // Clear broken image
                        e.target.style.display = 'none'; // Hide if error
                      }}
                    />
                  </Badge>
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ 
                  color: isActive('/login') ? 'primary.main' : 'text.primary',
                  fontWeight: 600,
                  borderBottom: isActive('/login') ? '2px solid' : 'none',
                  borderColor: 'primary.main'
                }}
              >
                Login
              </Button>
              
              <Button 
                variant="contained"
                color="primary"
                component={Link} 
                to="/register"
                sx={{ 
                  fontWeight: 600,
                  ml: 1
                }}
              >
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