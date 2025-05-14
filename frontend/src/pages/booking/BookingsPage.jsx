import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Pagination,
  Button,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import EventIcon from '@mui/icons-material/Event';

const BookingsPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/bookings?page=${page}&limit=10`);
        
        // Filter bookings to only show current user's bookings unless admin
        if (user.role !== 'admin') {
          const userBookings = res.data.data.filter(
            booking => booking.user._id === user.id
          );
          setBookings(userBookings);
          setTotal(userBookings.length); // Adjust total count
        } else {
          setBookings(res.data.data);
          setTotal(res.data.count);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page, user]);

  const handlePageChange = (event, value) => {
    setPage(value);
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
      <Container maxWidth="xl" sx={{ my: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            gap: 2
          }}
        >
          <EventIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            You haven't made any bookings yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/events"
            sx={{ mt: 2 }}
          >
            Browse Events
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="bookings table">
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  {!isMobile && <TableCell>Date</TableCell>}
                  <TableCell>Tickets</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {booking.event.title}
                      </Typography>
                      {!isMobile && (
                        <Typography variant="body2" color="text.secondary">
                          {booking.event.location}
                        </Typography>
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        {dayjs(booking.event.date).format('MMM D, YYYY')}
                      </TableCell>
                    )}
                    <TableCell>
                      {booking.tickets.map((ticket, index) => (
                        <Typography key={index} variant="body2">
                          {ticket.quantity} × {ticket.type} (${ticket.price.toFixed(2)})
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">
                        ${booking.totalAmount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status.toUpperCase()}
                        color={
                          booking.status === 'confirmed'
                            ? 'success'
                            : booking.status === 'cancelled'
                            ? 'error'
                            : 'warning'
                        }
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={`/bookings/${booking._id}`}
                        sx={{ textTransform: 'none' }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {total > 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={Math.ceil(total / 10)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default BookingsPage;