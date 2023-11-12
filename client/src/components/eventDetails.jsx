import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [creatorName, setCreatorName] = useState(''); 

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const userId = localStorage.getItem("user._id").replace(/"/g, "");

  console.log("user._id in localStorage:", localStorage.getItem("user._id"));
  console.log("userId:", userId);

  const fetchCreatorName = (creatorId) => {
    console.log('Fetching creator name for creatorId:', creatorId);
    axios
      .get(`http://localhost:8000/api/users/${creatorId}`)
      .then((res) => {
        console.log('Fetched creator data:', res.data); 
        setCreatorName(`${res.data.user.firstName} ${res.data.user.lastName}`);
      })
      .catch((err) => {
        console.log('Failed to fetch creator name', err);
      });
  };

  useEffect(() => {
    console.log('Token:', token);
    axios
      .get(`http://localhost:8000/api/events/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEvent(res.data.oneEvent);
        console.log('token',token);
        fetchCreatorName(res.data.oneEvent.creator._id);
      })
      .catch((err) => {
        console.log('An error occurred', err);
      });
  }, [id, token]);

  const deleteEvent = (deleteId) => {
    axios
      .delete(`http://localhost:8000/api/event/${deleteId}/delete`)
      .then((res) => {
        console.log(res.data);
        console.log('DELETE SUCCESS!');
        setEvent(event.filter((e) => e._id !== deleteId));
        navigate("/events");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const bookEvent = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/events/${event._id}/book`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        // Event booked successfully
        console.log('Event booked:', response.data);
        //the ticket creation function
        createTicket();
      } else if (response.status === 400) {
        alert('You are already registered for this event');
      }
    } catch (error) {
      console.error('Failed to book event:', error);
    }
  };
  const createTicket = async () => {
    console.log("userId:", userId);
    console.log("eventId:", event._id);
    try {
      if (!event || !event._id || !userId) {
        console.error('Event or userId is missing or invalid');
        return;
      }
  
      const ticketResponse = await axios.post(
        `http://localhost:8000/api/events/${event._id}/${userId}/tickets`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (ticketResponse.status === 201) {
        console.log('Ticket issued successfully:', ticketResponse.data);
        navigate('/events/participated');
      } else {
        console.error('Failed to issue a ticket:', ticketResponse.data);
      }
    } catch (error) {
      console.error('Failed to create a ticket:', error);
    }
  };
  


  return (
    <>
     {event ? (
  <div>
    <div className='nav'>
      <h1>{event.title}</h1>
    </div>
    <div className='container'>
      <div className='flex-container'>
        <div className='prof-right'>
          <p>Date: {new Date(event.date).toLocaleDateString()} at {event.time}</p>
          <p>Location: {event.location}</p>    
          <p>Creator: {creatorName}</p>
          <p>Description: {event.description}</p>
          {event.creator && event.creator._id === userId && (
            <>
              <button className="btn2" onClick={() => deleteEvent(event._id)}>Delete</button>
              <Link to={`/events/${event._id}/edit`}><button className="btn2">Edit</button></Link>
            </>
          )}
         {event.creator._id !== userId && (
            <button className="btn2" onClick={bookEvent}>Book Event</button>
         )}
           </div>
             </div>
           </div>
         </div>
       ) : (
         <p>Loading...</p>
       )}
     </>
   );
 };
export default EventDetails;
