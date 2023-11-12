const Ticket = require('../models/ticket.model');
const Event = require('../models/event.model');
const User = require('../models/user.model');

// Create and issue a new ticket for a user who has booked an event
module.exports.issueTicket = async (req,res) => {
  try {
    const {userId } = req.params;
    const eventId = req.params.eventId;

    // Check if the user has booked the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is already registered for the event
    if (!event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'User is not registered for this event' });
    }
    const ticketCode = generateUniqueTicketCode();

    // Create a new ticket
    const newTicket = new Ticket({
      eventId: eventId,
      userId: userId,
      ticketCode: ticketCode,
    });

    // Save the ticket to the database
    await newTicket.save();

    return res.status(201).json({ message: 'Ticket issued successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error issuing ticket:', error);
    res.status(500).json({ message: 'Error issuing ticket', error: error });
  }
};

// Validate a ticket 
module.exports.validateTicket = async (req, res) => {
  try {
    const { ticketCode } = req.body;

    // Find the ticket by the ticket code
    const ticket = await Ticket.findOne({ ticketCode: ticketCode });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    //checking if the ticket is valid for the current event

    return res.status(200).json({ message: 'Ticket is valid', ticket: ticket });
  } catch (error) {
    console.error('Error validating ticket:', error);
    res.status(500).json({ message: 'Error validating ticket', error: error });
  }
};

//display the ticket
module.exports.getUserTickets = async (req, res) => {
  try {
    const {userId } = req.params;
    const eventId = req.params.eventId;

    // Log the eventId and userId to verify they are correct
    console.log('Event ID:', eventId);
    console.log('User ID:', userId);

    const userTickets = await Ticket.find({ eventId: eventId, userId: userId });

    // Log the userTickets array for debugging
    console.log('User Tickets:', userTickets);
    //check if the ticket is created 
    if (!userTickets || userTickets.length === 0) {
      return res.status(404).json({ message: 'No tickets found for this user and event' });
    }

    return res.status(200).json({ tickets: userTickets });
  } catch (error) {
    console.error('Error retrieving user tickets:', error);
    res.status(500).json({ message: 'Error retrieving user tickets', error: error.message });
  }
};


function generateUniqueTicketCode() {
  // Generate a random string for the ticket code
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let ticketCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    ticketCode += characters.charAt(randomIndex);
  }

  return ticketCode;
}

