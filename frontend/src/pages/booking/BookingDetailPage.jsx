import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/bookings/${id}`);
        
        // Verify the booking belongs to the user or user is admin
        if (res.data.data.user._id !== user.id && user.role !== 'admin') {
          navigate('/bookings', { replace: true });
          return;
        }
        
        setBooking(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, user, navigate]);

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      await api.put(`/bookings/${id}/cancel`);
      setBooking({ ...booking, status: 'cancelled' });
      setSnackbarMessage('Booking cancelled successfully');
      setSnackbarSeverity('success');
    } catch (err) {
      setSnackbarMessage(err.response?.data?.message || 'Failed to cancel booking');
      setSnackbarSeverity('error');
    } finally {
      setCancelling(false);
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/bookings')}>
          Back to My Bookings
        </Button>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h6">Booking not found</Typography>
        <Button variant="contained" onClick={() => navigate('/bookings')}>
          Back to My Bookings
        </Button>
      </Container>
    );
  }

  const isPastEvent = dayjs(booking.event.date).isBefore(dayjs(), 'day');
  const canCancel = booking.status === 'confirmed' && !isPastEvent;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Booking Details
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {booking.event.title}
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body1">
                  <strong>Booking ID:</strong> {booking._id}
                </Typography>
                <Chip
                  label={booking.status.toUpperCase()}
                  color={
                    booking.status === 'confirmed'
                      ? 'success'
                      : booking.status === 'cancelled'
                      ? 'error'
                      : 'warning'
                  }
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Event Date:</strong> {dayjs(booking.event.date).format('dddd, MMMM D, YYYY')}
                </Typography>
                <Typography variant="body1">
                  <strong>Time:</strong> {booking.event.time}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Location:</strong> {booking.event.location}
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Booked On:</strong> {dayjs(booking.bookingDate).format('MMM D, YYYY h:mm A')}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Tickets
              </Typography>
              <Divider sx={{ my: 2 }} />

              {booking.tickets.map((ticket, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>{ticket.type.toUpperCase()}:</strong> {ticket.quantity} × ${ticket.price.toFixed(2)} = ${(ticket.quantity * ticket.price).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ textAlign: 'right', fontWeight: 600 }}>
                Total: ${booking.totalAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: isMobile ? 'static' : 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Booking Actions
              </Typography>
              <Divider sx={{ my: 2 }} />

              {canCancel && (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  sx={{ mb: 2 }}
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  startIcon={cancelling ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </Button>
              )}

              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to={`/events/${booking.event._id}`}
                sx={{ mb: 2 }}
              >
                View Event Details
              </Button>

              {booking.status === 'cancelled' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Your refund will be processed within 5-7 business days.
                </Alert>
              )}

              {isPastEvent && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  This event has already taken place.
                </Alert>
              )}
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

export default BookingDetailPage;