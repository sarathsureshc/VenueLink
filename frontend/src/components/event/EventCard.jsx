import { Card, CardMedia, CardContent, Typography, Button, CardActions, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from 'dayjs';

const EventCard = ({ event }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:5000/uploads/${event.image}`}
        alt={event.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon color="action" sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="body2">
            {dayjs(event.date).format('MMM D, YYYY')} at {event.time}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon color="action" sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="body2">{event.location}</Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          size="small"
          color="primary"
          component={Link}
          to={`/events/${event._id}`}
          sx={{ fontWeight: 600 }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;