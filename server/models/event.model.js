const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: [true, "The event title is required."]
  },
  description: {
    type: String,
    required: [true, "the event description is required."]
  },
  date: {
    type: Date,
    required: [true, "The event date is required."]
  },
  time: {
    type: String,
    required: [true, "The event time is required."]
  },
  location: {
    type: String,
    required: [true, "The event location is required."]
  },
  category: {
    type: String,
    required: [true, "The event category is required."]
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }],
  bookingDate: Date,
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
