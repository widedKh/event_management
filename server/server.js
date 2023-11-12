const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Configure environment variables 
dotenv.config({ path: './config/config.env' });

// Create an Express app
const app = express(); 

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // To ensure unique indexes work
})
  .then(() => {
    console.log('Established a connection to the database');
  })
  .catch(err => {
    console.error('Something went wrong when connecting to the database', err);
  });



// Event routes
require('./routes/event.routes')(app); 

// User routes 
require('./routes/user.routes')(app); 

//Ticket routes
require('./routes/ticket.routes')(app);

// Start the server
const PORT = process.env.PORT || 8000; // Use the defined PORT or fallback to 8000
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
