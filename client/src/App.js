
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './components/signUp';
import SignIn from './components/signIn';
import AllEvents   from './components/allEvents';
import HostEvent   from './components/hostEvent';
import EventDetails   from './components/eventDetails';
import UpdateEvent from './components/updateEvent'
import ParticipatedEvents  from './components/participatedEvents';
import MyEvents from './components/myEvents';
import Ticket from  './components/ticket';




function App() { 
 
 
  return (
    <div className="App"> 
    
       < Navbar   />
       <Routes>
        <Route path="/" element={<SignUp/>} />
        <Route path="/register" element={<SignUp/>} />
        <Route path="/login" element={<SignIn/>} />
        <Route path="/events" element={<AllEvents />} />
        <Route path="/event/new" element={<HostEvent/>} />
        <Route path="/events/:id" element={<EventDetails/>} />
        <Route path="/events/participated" element={<ParticipatedEvents/>} />
        <Route path="/events/:id/edit" element={<UpdateEvent/>} />
        <Route path="/myevents" element={<MyEvents/>} />
        <Route path="/events/:eventId/:userId/tickets" element={<Ticket/>} />
      </Routes>

    </div>
   
  );
}

export default App;
