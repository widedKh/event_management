const TicketController = require('../controllers/ticket.controller');
const { authenticate } = require('../middleware/authenticate');


module.exports = (app) => {
    app.post('/api/events/:eventId/:userId/tickets',authenticate,TicketController.issueTicket);
    app.get('/api/events/:eventId/:userId/tickets', authenticate,TicketController.getUserTickets);
    app.get('/api/tickets/:ticketCode', authenticate, TicketController.validateTicket);
  };
