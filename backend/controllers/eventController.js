const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { sendEmail } = require('../config/email');
const path = require('path');
const fs = require('fs');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = Event.find(JSON.parse(queryStr)).populate('createdBy', 'name');

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Event.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const events = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: events.length,
      pagination,
      data: events,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/EventManager
exports.createEvent = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Check if user is event manager or admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'event_manager' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create events',
      });
    }

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/EventManager
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Make sure user is event owner or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Track changes
    const originalEvent = { ...event._doc };
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Check if any significant changes were made
    const changes = {};
    const fieldsToCheck = ['title', 'description', 'date', 'time', 'location', 'tickets', 'status'];

    fieldsToCheck.forEach(field => {
      if (JSON.stringify(originalEvent[field]) !== JSON.stringify(event[field])) {
        changes[field] = {
          oldValue: originalEvent[field],
          newValue: event[field],
        };
      }
    });

    // If there are changes, notify booked users
    if (Object.keys(changes).length > 0) {
      // Record edit history
      const editHistory = Object.keys(changes).map(field => ({
        field,
        oldValue: changes[field].oldValue,
        newValue: changes[field].newValue,
      }));

      event.isEdited = true;
      event.editHistory = [...(event.editHistory || []), ...editHistory];
      await event.save();

      // Find all bookings for this event
      const bookings = await Booking.find({ event: event._id }).populate('user', 'email name');

      // Send notifications
      for (const booking of bookings) {
        // Create notification
        await Notification.create({
          user: booking.user._id,
          event: event._id,
          message: `Event "${event.title}" has been updated. Please check the changes.`,
        });

        // Send email
        const message = `
          <p>Dear ${booking.user.name},</p>
          <p>The event "${event.title}" that you booked has been updated. Here are the changes:</p>
          <ul>
            ${Object.keys(changes)
              .map(
                field => `
              <li>
                <strong>${field}:</strong> 
                From "${changes[field].oldValue}" to "${changes[field].newValue}"
              </li>
            `
              )
              .join('')}
          </ul>
          <p>Please visit our website for more details.</p>
        `;

        await sendEmail({
          email: booking.user.email,
          subject: `Event Updated: ${event.title}`,
          html: message,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/EventManager/Admin
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Make sure user is event owner or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    // Delete image from uploads
    if (event.image) {
      const imagePath = path.join(__dirname, '../uploads', event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await event.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload photo for event
// @route   PUT /api/events/:id/photo
// @access  Private/EventManager
exports.uploadEventPhoto = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Make sure user is event owner or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    // Delete old image if exists
    if (event.image) {
      const oldImagePath = path.join(__dirname, '../uploads', event.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    event.image = req.file.filename;
    await event.save();

    res.status(200).json({
      success: true,
      data: event.image,
    });
  } catch (err) {
    next(err);
  }
};