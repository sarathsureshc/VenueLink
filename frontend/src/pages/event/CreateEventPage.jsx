import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../../services/api';
import FileUpload from '../../../components/common/FileUpload';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [tickets, setTickets] = useState([
    { type: 'vip', price: 100, quantity: 50, available: 50 },
  ]);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      date: dayjs().add(7, 'day'),
      time: '19:00',
      location: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      date: Yup.date().required('Required'),
      time: Yup.string().required('Required'),
      location: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const eventData = {
          ...values,
          date: values.date.toISOString(),
          tickets,
        };

        const res = await api.post('/events', eventData);

        if (image) {
          const formData = new FormData();
          formData.append('image', image);

          await api.put(`/events/${res.data.data._id}/photo`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        navigate('/my-events');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleAddTicket = () => {
    setTickets([
      ...tickets,
      { type: 'economy', price: 20, quantity: 100, available: 100 },
    ]);
  };

  const handleRemoveTicket = (index) => {
    const newTickets = [...tickets];
    newTickets.splice(index, 1);
    setTickets(newTickets);
  };

  const handleTicketChange = (index, field, value) => {
    const newTickets = [...tickets];
    newTickets[index][field] = value;

    if (field === 'quantity') {
      newTickets[index].available = value;
    }

    setTickets(newTickets);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Event
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Event Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <TextField
                  fullWidth
                  label="Event Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description && Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  sx={{ mb: 3 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.category && Boolean(formik.errors.category)
                    }
                  >
                    <MenuItem value="concert">Concert</MenuItem>
                    <MenuItem value="dj">DJ Party</MenuItem>
                    <MenuItem value="theater">Theater</MenuItem>
                    <MenuItem value="sports">Sports</MenuItem>
                    <MenuItem value="conference">Conference</MenuItem>
                    <MenuItem value="exhibition">Exhibition</MenuItem>
                  </Select>
                </FormControl>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Event Date"
                        value={formik.values.date}
                        onChange={(value) =>
                          formik.setFieldValue('date', value, true)
                        }
                        minDate={dayjs().add(1, 'day')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={
                              formik.touched.date && Boolean(formik.errors.date)
                            }
                            helperText={formik.touched.date && formik.errors.date}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Time"
                      name="time"
                      type="time"
                      value={formik.values.time}
                      onChange={formik.handleChange}
                      error={formik.touched.time && Boolean(formik.errors.time)}
                      helperText={formik.touched.time && formik.errors.time}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                  sx={{ mb: 3 }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Tickets</Typography>
                  <Button
                    variant="outlined"
                    onClick={handleAddTicket}
                    disabled={tickets.length >= 4}
                  >
                    Add Ticket Type
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {tickets.map((ticket, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1">
                        Ticket Type #{index + 1}
                      </Typography>
                      {tickets.length > 1 && (
                        <Chip
                          label="Remove"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveTicket(index)}
                        />
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Type</InputLabel>
                          <Select
                            value={ticket.type}
                            onChange={(e) =>
                              handleTicketChange(index, 'type', e.target.value)
                            }
                            label="Type"
                          >
                            <MenuItem value="vip">VIP</MenuItem>
                            <MenuItem value="premium">Premium</MenuItem>
                            <MenuItem value="standard">Standard</MenuItem>
                            <MenuItem value="economy">Economy</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Price ($)"
                          type="number"
                          value={ticket.price}
                          onChange={(e) =>
                            handleTicketChange(
                              index,
                              'price',
                              parseFloat(e.target.value)
                            )
                          }
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={ticket.quantity}
                          onChange={(e) =>
                            handleTicketChange(
                              index,
                              'quantity',
                              parseInt(e.target.value)
                            )
                          }
                          inputProps={{ min: 1 }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Event Image
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FileUpload
                  onFileChange={(file) => setImage(file)}
                  accept="image/*"
                />

                {image && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Selected: {image.name}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateEventPage;