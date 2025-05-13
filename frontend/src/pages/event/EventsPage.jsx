import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../../../components/event/EventCard';
import api from '../../../services/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: '-createdAt',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit,
          ...filters,
        };

        const res = await api.get('/events', { params });
        setEvents(res.data.data);
        setTotal(res.data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, limit, filters]);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    setFilters({
      category: category || '',
      search: search || '',
      sort: sort || '-createdAt',
    });
  }, [searchParams]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setSearchParams({ ...filters, [name]: value });
  };

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upcoming Events
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Events"
              variant="outlined"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="concert">Concert</MenuItem>
                <MenuItem value="dj">DJ Party</MenuItem>
                <MenuItem value="theater">Theater</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="conference">Conference</MenuItem>
                <MenuItem value="exhibition">Exhibition</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                label="Sort By"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <MenuItem value="-createdAt">Newest First</MenuItem>
                <MenuItem value="createdAt">Oldest First</MenuItem>
                <MenuItem value="date">Date (Ascending)</MenuItem>
                <MenuItem value="-date">Date (Descending)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : events.length === 0 ? (
        <Typography variant="h6" align="center">
          No events found
        </Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item key={event._id} xs={12} sm={6} md={4} lg={3}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>

          <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}
    </Container>
  );
};

export default EventsPage;