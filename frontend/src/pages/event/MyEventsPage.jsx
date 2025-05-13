import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EventIcon from '@mui/icons-material/Event';
import dayjs from 'dayjs';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const MyEventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events?createdBy=${user.id}&page=${page}&limit=10`);
        setEvents(res.data.data);
                setTotal(res.data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user.id, page]);

  const handleMenuOpen = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteEvent = async () => {
    try {
      await api.delete(`/events/${selectedEvent}`);
      setEvents(events.filter(event => event._id !== selectedEvent));
      handleMenuClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Events
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/create-event"
        >
          Create New Event
        </Button>
      </Box>

      {events.length === 0 ? (
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
          <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            You haven't created any events yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/create-event"
            sx={{ mt: 2 }}
          >
            Create Your First Event
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>
                      <Typography variant="subtitle1">{event.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {dayjs(event.date).format('MMM D, YYYY')} at {event.time}
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={event.status}
                        color={
                          event.status === 'active'
                            ? 'success'
                            : event.status === 'cancelled'
                            ? 'error'
                            : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        aria-controls="event-menu"
                        aria-haspopup="true"
                        onClick={(e) => handleMenuOpen(e, event._id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Menu
            id="event-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              component={Link}
              to={`/events/${selectedEvent}`}
              onClick={handleMenuClose}
            >
              View Details
            </MenuItem>
            <MenuItem
              component={Link}
              to={`/edit-event/${selectedEvent}`}
              onClick={handleMenuClose}
            >
              Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteEvent}>Delete</MenuItem>
          </Menu>

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

export default MyEventsPage;