
const EventController = require('../controllers/event.controller');
const { authenticate } = require('../middleware/authenticate');


module.exports = (app) => {
  app.get('/api/events', EventController.findAllEvents);
  app.post('/api/event/new', authenticate, EventController.AddNewEvent);
  app.get('/api/events/:id',authenticate, EventController.findOneEvent);
  app.put('/api/events/:id/edit', authenticate, EventController.updateEvent); 
  app.delete('/api/event/:id/delete', EventController.deleteEvent);
  app.get('/api/events/participated/:userId',authenticate,  EventController.participatedEvents);
  app.post('/api/events/:id/book', authenticate, EventController.bookEvent);  
  app.get('/api/myevents', authenticate, EventController.findUserEvents); 


  
   
}    

