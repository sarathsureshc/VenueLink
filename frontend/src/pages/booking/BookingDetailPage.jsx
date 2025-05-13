import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import dayjs from 'dayjs';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBooking({ ...booking, status: 'cancelled' });
      setSnackbarMessage('Booking cancelled successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (err) {
      setSnackbarMessage(err.response?.data?.message || 'Cancellation failed');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!booking) return <div>Booking not found</div>;

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

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  <strong>Booking ID:</strong> {booking._id}
                </Typography>
                <Chip
                  label={booking.status}
                  color={
                    booking.status === 'confirmed'
                      ? 'success'
                      : booking.status === 'cancelled'
                      ? 'error'
                      : 'warning'
                  }
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Event Date:</strong> {dayjs(booking.event.date).format('dddd, MMMM D, YYYY')} at {booking.event.time}
              </Typography>

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
                    <strong>{ticket.type.toUpperCase()}:</strong> {ticket.quantity} x ${ticket.price} = ${ticket.quantity * ticket.price}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                Total: ${booking.totalAmount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Booking Actions
              </Typography>
              <Divider sx={{ my: 2 }} />

              {booking.status === 'confirmed' && (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  sx={{ mb: 2 }}
                  onClick={handleCancelBooking}
                  disabled={
                    dayjs(booking.event.date).isBefore(dayjs()) ||
                    booking.status !== 'confirmed'
                  }
                >
                  Cancel Booking
                </Button>
              )}

              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to={`/events/${booking.event._id}`}
              >
                View Event
              </Button>

              {booking.status === 'cancelled' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Your refund will be processed within 5-7 business days.
                </Alert>
              )}

              {dayjs(booking.event.date).isBefore(dayjs()) && (
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