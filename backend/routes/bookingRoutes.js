const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.route('/:id')
  .get(protect, getBooking);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

module.exports = router;