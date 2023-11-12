import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
//import "./App.css"; 

const MyEvents = () => {
  const [userEvents, setUserEvents] = useState([]);
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  const getEventStatus = (event) => {
    const currentDate = new Date();
    const eventDate = new Date(event.date);
    if (eventDate > currentDate) {
      return { text: "Upcoming", color: "green" };
    } else if (eventDate < currentDate) {
      return { text: "Completed", color: "red" };
    } else {
      return { text: "Ongoing", color: "orange" };
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/myevents", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserEvents(res.data.userEvents);
      })
      .catch((err) => {
        console.error("Error fetching user events:", err);
      });
  }, [token]);

  const deleteEvent = (deleteId) => {
    axios
      .delete(`http://localhost:8000/api/event/${deleteId}/delete`)
      .then((res) => {
        console.log(res.data);
        console.log("DELETE SUCCESS!");
        setUserEvents(userEvents.filter((e) => e._id !== deleteId));
        navigate("/myevents");
      })
      .catch((err) => {
        console.error("Error deleting event:", err);
      });
  };

  return (
    <div className="my-events-container">
      <h2>My Events</h2>
      <table className="event-table">
        <thead>
          <tr>
            <th>Event name</th>
            <th>Creation Date</th>
            <th>Event Date</th>
            <th>Event Status</th>
            <th>Number of Attendees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userEvents.map((event) => (
            <tr key={event._id}>
              <Link to={`/events/${event._id}`}>{event.title}</Link>
              <td>{new Date(event.createdAt).toLocaleDateString()}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td><span
                  style={{
                    backgroundColor: getEventStatus(event).color,
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "5px",
                  }}
                >
                  {getEventStatus(event).text}
                </span></td>
              <td>{event.attendees.length}</td>
              <td>
                <Link to={`/events/${event._id}/edit`}>
                  <button className="edit-button">Edit</button>
                </Link>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyEvents;

