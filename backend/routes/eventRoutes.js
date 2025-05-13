const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventPhoto,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, authorize('event_manager', 'admin'), createEvent);

router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('event_manager', 'admin'), updateEvent)
  .delete(protect, authorize('event_manager', 'admin'), deleteEvent);

router.route('/:id/photo')
  .put(protect, authorize('event_manager', 'admin'), upload.single('image'), uploadEventPhoto);

module.exports = router;