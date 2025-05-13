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
} from '@mui/material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const BookingsPage = () => {
  const { user } = useAuth();
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
        setBookings(res.data.data);
        setTotal(res.data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center',
          }}
        >
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Date</TableCell>
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
                      <Typography variant="subtitle1">
                        {booking.event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {booking.event.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {dayjs(booking.event.date).format('MMM D, YYYY')}
                    </TableCell>
                    <TableCell>
                      {booking.tickets.map((ticket, index) => (
                        <div key={index}>
                          {ticket.quantity} x {ticket.type} (${ticket.price})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>${booking.totalAmount}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={
                          booking.status === 'confirmed'
                            ? 'success'
                            : booking.status === 'cancelled'
                            ? 'error'
                            : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={`/bookings/${booking._id}`}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(total / 10)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default BookingsPage;