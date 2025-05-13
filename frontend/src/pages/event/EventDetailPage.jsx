import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketType, setTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBookNow = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    try {
      const res = await api.post('/bookings', {
        event: id,
        tickets: [
          {
            type: ticketType,
            quantity: quantity,
          },
        ],
      });

      setSnackbarMessage('Booking successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate(`/bookings/${res.data.data._id}`);
    } catch (err) {
      setSnackbarMessage(err.response?.data?.message || 'Booking failed');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1" gutterBottom>
            {event.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {dayjs(event.date).format('dddd, MMMM D, YYYY')} at {event.time}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <LocationOnIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body1">{event.location}</Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              About the Event
            </Typography>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
          </Box>

          {event.isEdited && (
            <Alert severity="info" sx={{ mb: 4 }}>
              This event has been updated since it was created. Please check the details carefully.
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Event Image
            </Typography>
            <img
              src={`http://localhost:5000/uploads/${event.image}`}
              alt={event.title}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Book Tickets
              </Typography>
              <Divider sx={{ my: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Ticket Type</InputLabel>
                <Select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  label="Ticket Type"
                >
                  {event.tickets.map((ticket) => (
                    <MenuItem
                      key={ticket.type}
                      value={ticket.type}
                      disabled={ticket.available <= 0}
                    >
                      {ticket.type.toUpperCase()} - ${ticket.price} (
                      {ticket.available} available)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBookNow}
                disabled={!ticketType}
              >
                Book Now
              </Button>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  * Prices include all applicable taxes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventDetailPage;