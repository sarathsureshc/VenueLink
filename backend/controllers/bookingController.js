const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail } = require('../config/email');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'admin') {
      query = Booking.find().populate('event user');
    } else if (req.user.role === 'event_manager') {
      // Get events created by this manager
      const events = await Event.find({ createdBy: req.user.id });
      const eventIds = events.map(event => event._id);
      query = Booking.find({ event: { $in: eventIds } }).populate('event user');
    } else {
      // Regular user can only see their own bookings
      query = Booking.find({ user: req.user.id }).populate('event');
    }

    const bookings = await query;

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event user');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Make sure user is booking owner, event manager or admin
    if (
      booking.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      booking.event.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const event = await Event.findById(req.body.event);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if event is active
    if (event.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Cannot book this event as it is ${event.status}`,
      });
    }

    // Validate tickets
    let totalAmount = 0;
    const ticketUpdates = [];

    for (const ticket of req.body.tickets) {
      const eventTicket = event.tickets.find(t => t.type === ticket.type);
      if (!eventTicket) {
        return res.status(400).json({
          success: false,
          message: `Ticket type ${ticket.type} not available for this event`,
        });
      }

      if (ticket.quantity > eventTicket.available) {
        return res.status(400).json({
          success: false,
          message: `Not enough ${ticket.type} tickets available. Only ${eventTicket.available} left.`,
        });
      }

      totalAmount += eventTicket.price * ticket.quantity;
      ticket.price = eventTicket.price;

      // Prepare updates for event tickets
      ticketUpdates.push({
        updateOne: {
          filter: { _id: event._id, 'tickets.type': ticket.type },
          update: { $inc: { 'tickets.$.available': -ticket.quantity } },
        },
      });
    }

    // Add total amount to req.body
    req.body.totalAmount = totalAmount;

    // Create booking
    const booking = await Booking.create(req.body);

    // Update event ticket availability
    await Event.bulkWrite(ticketUpdates);

    // Get user details for email
    const user = await User.findById(req.user.id);

    // Send confirmation email
    const message = `
      <h2>Booking Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Your booking for "${event.title}" has been confirmed.</p>
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <p><strong>Event Date:</strong> ${new Date(event.date).toLocaleDateString()} at ${event.time}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Tickets:</strong></p>
      <ul>
        ${booking.tickets
          .map(
            ticket => `
          <li>${ticket.quantity} x ${ticket.type} @ $${ticket.price} each</li>
        `
          )
          .join('')}
      </ul>
      <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
      <p>Thank you for booking with us!</p>
    `;

    await sendEmail({
      email: user.email,
      subject: `Booking Confirmation: ${event.title}`,
      html: message,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id).populate('event');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Check if event has already occurred
    const eventDate = new Date(booking.event.date);
    if (eventDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking for past event',
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Return tickets to event availability
    const ticketUpdates = booking.tickets.map(ticket => ({
      updateOne: {
        filter: { _id: booking.event._id, 'tickets.type': ticket.type },
        update: { $inc: { 'tickets.$.available': ticket.quantity } },
      },
    }));

    await Event.bulkWrite(ticketUpdates);

    // Get user details for email
    const user = await User.findById(booking.user);

    // Send cancellation email
    const message = `
      <h2>Booking Cancellation</h2>
      <p>Dear ${user.name},</p>
      <p>Your booking for "${booking.event.title}" has been cancelled.</p>
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <p><strong>Refund Amount:</strong> $${booking.totalAmount}</p>
      <p>The refund will be processed within 5-7 business days.</p>
      <p>We hope to see you at another event soon!</p>
    `;

    await sendEmail({
      email: user.email,
      subject: `Booking Cancellation: ${booking.event.title}`,
      html: message,
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};