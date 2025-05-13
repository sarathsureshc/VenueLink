import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import EventCard from '../../components/event/EventCard';
import { useFetch } from '../../hooks/useFetch';

const HomePage = () => {
  const { data: events, loading, error } = useFetch('/events?limit=3&sort=-createdAt');

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          my: 4,
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 10,
          borderRadius: 2,
          color: 'white',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Discover Amazing Events
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Book tickets for your favorite concerts, shows, and more
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="/events"
          sx={{ mt: 3 }}
        >
          Browse Events
        </Button>
      </Box>

      <Typography variant="h4" component="h2" sx={{ mt: 6, mb: 3 }}>
        Featured Events
      </Typography>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Grid container spacing={4}>
          {events?.data?.map((event) => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          component={Link}
          to="/events"
        >
          View All Events
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;