import { Box, Container, Typography, Button, Grid, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import EventCard from '../components/event/EventCard';
import { useFetch } from '../hooks/useFetch';
import HeroImage from '../assets/images/hero.jpg';
import { CircularProgress, Alert } from '@mui/material';
console.log("HomePage module evaluated");

const HomePage = () => {
  console.log("HomePage mounted!");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: events, loading, error } = useFetch('/events?limit=3&sort=-createdAt');

  console.log("🔍 Events fetched:", events);
  console.log("⏳ Loading:", loading);
  console.log("❌ Error:", error);


  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${HeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: isMobile ? '60vh' : '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          p: 4,
          mb: 6
        }}
      >
        <Typography 
          variant={isMobile ? 'h3' : 'h2'} 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Discover Amazing Events
        </Typography>
        <Typography 
          variant={isMobile ? 'h6' : 'h5'} 
          component="p" 
          gutterBottom
          sx={{ 
            mb: 4,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          Book tickets for your favorite concerts, shows, and more
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/register"
            sx={{ 
              px: 4,
              py: 1.5,
              fontWeight: 600
            }}
          >
            Register Now
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            component={Link}
            to="/login"
            sx={{ 
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            Login
          </Button>
        </Box>
      </Box>

      {/* Featured Events Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4,
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          Featured Events
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {events?.data?.map((event) => (
              <Grid item key={event._id} xs={12} sm={6} md={4}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            to="/events"
            sx={{ 
              px: 6,
              py: 1.5,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            View All Events
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;