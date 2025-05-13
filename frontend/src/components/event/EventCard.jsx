import { Card, CardMedia, CardContent, Typography, Button, CardActions, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from 'dayjs';

const EventCard = ({ event }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:5000/uploads/${event.image}`}
        alt={event.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h3">
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description.length > 100
            ? `${event.description.substring(0, 100)}...`
            : event.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">
            {dayjs(event.date).format('MMM D, YYYY')} at {event.time}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">{event.location}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          component={Link}
          to={`/events/${event._id}`}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;