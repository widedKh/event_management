const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt.config.js')
const Event = require('../models/event.model');
const User = require('../models/user.model');
const TicketController = require('../controllers/ticket.controller'); 




//display all events
module.exports.findAllEvents = (req, res) => {
Event.find()
    .then((allEvents) => {
      //console.log(allEvents);
      res.json({ allEvents });
    })
    .catch((err) => {
      res.json({ message: "error" });
    });
};


//Add a new event
module.exports.AddNewEvent = (req, res) => {
  const eventData = req.body;
  const userToken = req.cookies.userToken;

  jwt.verify(userToken, secret, (err, payload) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.status(401).json({ verified: false, message: 'Token verification failed',err });
    }

    // The user's ID can be retrieved from the payload
    const userId = payload.id;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        eventData.creator = user; // Associate the event with the user
        console.log('Event Data:', eventData); // Check the eventData before creating the event

        Event.create(eventData)
          .then((event) => {
            res.status(201).json({ message: 'Event created', event });
          })
          .catch((err) => {
            res.status(400).json({ message: 'Event creation failed', err });
          });
      })
      .catch((err) => {
        res.status(500).json({ message: 'User retrieval failed',err });
      });
  });
};


  //  display the Event's profile
  module.exports.findOneEvent = (req, res) => {
    const eventId = req.params.id;

  
    Event.findOne({ _id: eventId })
      .populate('creator', 'name')
      .then(oneEvent => {
        if (!oneEvent) {
          return res.status(404).json({ error: 'Event not found' });
        }
        console.log('Found Event:', oneEvent);
        console.log("eventId", eventId);
        res.json({ oneEvent });
      })
      .catch(err => {
        console.error('Error in findOneEvent:', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  };
  

// Update an event 
module.exports.updateEvent = (req, res) => {
  const eventId = req.params.id;
  const eventData = req.body;

  // Fetch the existing event to preserve the creator information
  Event.findById(eventId)
    .then(existingEvent => {
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // retain the creator information in eventData
      eventData.creator = existingEvent.creator;

      // Update the event with the retained creator information
      Event.findByIdAndUpdate(eventId, eventData, { new: true })
        .then(updatedEvent => {
          console.log(updatedEvent);
          res.json({ updatedEvent });
        })
        .catch(err => {
          console.error(err);
          res.status(400).json({ message: 'Error updating the event', err });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({ message: 'Error fetching the existing event', error: err });
    });
};

// Delete an event 
module.exports.deleteEvent= (req, res) => {
  Event.deleteOne({ _id: req.params.id })
    .then((deleteConfirmation) => {
      console.log(deleteConfirmation);
      res.json({deleteConfirmation});
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: "The Event cannot be deleted" });
    });
  };

  
 // display the participted events
module.exports.participatedEvents = (req, res) => {
  const userId = req.user.id;

  Event.find({ attendees: userId })
    .then((participatedEvents) => {
      console.log("participatedEvents",participatedEvents)
      res.json({participatedEvents});
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching participated events", error: err });
    });
};

//participate in an event
module.exports.bookEvent = (req, res) => {
  const eventId = req.params.id;
  const userToken = req.cookies.userToken;

  jwt.verify(userToken, secret, async (err, payload) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.status(401).json({ verified: false, message: 'Token verification failed' });
    }

    // The user's ID can be retrieved from the payload
    const userId = payload.id;

    // Capture the current date and time as the booking date
    const bookingDate = new Date();

    try {
      const event = await Event.findById(eventId);
      //check if the event is not found
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
       
      //check if the user is the event's creator
      if (event.creator.toString() === userId) {
        return res.status(403).json({ message: 'Event creator cannot book their own event' });
      }

      //check if the user is already registred for the event
      if (event.attendees.includes(userId)) {
        return res.status(400).json({ message: 'User is already registered for this event' });
      }
      
      event.attendees.push(userId);
      event.bookingDate = bookingDate;

      event.save();

      res.status(201).json({ message: 'Event booked successfully'});
    } catch (err) {
      console.error('Error booking the event:', err);
      res.status(500).json({ message: 'Error booking the event', error: err });
    }
  });
};



// Retrieve events created by the user
module.exports.findUserEvents = (req, res) => {
  const userId = req.user.id;

  Event.find({ "creator": userId })
    .then((userEvents) => {
      res.json({ userEvents });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching user events", error: err });
    });
};


//add a category filter
module.exports.getCategories = async (req, res) => {
Event.distinct('category', (err, categories) => {
  if (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } else {
    console.log(categories);
    // Add 'All' as an option
    categories.unshift('All'); 
    res.json(categories);
  }
});
};

