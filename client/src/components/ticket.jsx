import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Ticket = () => {
  const [userTickets, setUserTickets] = useState([]);
  const { userId, eventId } = useParams();
  const token = localStorage.getItem('userToken');
  const userName = JSON.parse(localStorage.getItem("name"));

  // Function to fetch event details for a given event ID
  const fetchEventDetails = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/events/${eventId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.oneEvent;
    } catch (error) {
      console.error('Error fetching event details:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Fetch the user's tickets
    axios
      .get(`http://localhost:8000/api/events/${eventId}/${userId}/tickets`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response) => {
        const tickets = response.data.tickets;
        const ticketDetailsPromises = tickets.map(async (ticket) => {
          // Fetch event details for each ticket using the separate method
          try {
            const event = await fetchEventDetails(ticket.eventId);
            return { ...ticket, event };
          } catch (error) {
            // Handle errors, e.g., logging the error
            return ticket; // Return the ticket without event details
          }
        });

        // Wait for all promises to resolve
        const ticketDetails = await Promise.all(ticketDetailsPromises);

        setUserTickets(ticketDetails);
      })
      .catch((error) => {
        console.error('Error fetching user tickets:', error);
        // Handle errors, e.g., displaying an error message to the user
      });
  }, [eventId, userId, token]);

  return (
    <div className="ticket">
    <h2>My Tickets</h2>
    {userTickets.map((ticket) => (
      <div key={ticket._id} className="ticket-details">
        <p>Event Title: {ticket.event.title}</p>
        <p>event Date: {new Date(ticket.event.date).toLocaleDateString()}</p>
        <p>Issue Date: {new Date(ticket.issueDate).toLocaleDateString()}</p>
        <QRCode
          value={`Welcome ${userName} we are excited to have you here. We hope you enjoy the event. Ticket Code: ${ticket.ticketCode}`}
          size={128}
          className="qr-code"
        />
      </div>
    ))}
  </div>
  
  );
};

export default Ticket;
