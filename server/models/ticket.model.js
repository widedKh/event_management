const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', 
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  ticketCode: {
    type: String, 
    required: true,
    unique: true, 
  },
  qrCode: {
    type: String, 
  },
  issueDate: {
    type: Date, 
    default: Date.now, 
  },
 
});

const Ticket= mongoose.model('Ticket', ticketSchema );
module.exports = Ticket;