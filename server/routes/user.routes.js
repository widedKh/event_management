const UserController = require('../controllers/user.controller'); 

const { authenticate } = require('../middleware/authenticate');

module.exports = (app) => {

    app.post('/api/register', UserController.register)
    app.post('/api/login', UserController.login)
    app.get('/api/users/:id',  UserController.findOneUser); 
    app.get('/api/users', authenticate, UserController.findAllUser); 
    app.post('/api/logout',UserController.logout)
    
}