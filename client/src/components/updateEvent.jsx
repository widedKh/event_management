import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
//import Cookies from 'js-cookie';

const UpdateEvent = () => {
  const { id } = useParams(); 
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  // Define state variables to store form data
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
  });
  const [errors, setErrors] = useState([]);

  // Fetch the event data when the component loads
  useEffect(() => {
    axios.get(`http://localhost:8000/api/events/${id}`, {
      withCredentials: true,
      // Add the necessary headers for authentication if required
    })
    .then((response) => {
      // Populate the event state with the retrieved data
      setEvent(response.data.oneEvent);
    })
    .catch((error) => {
      console.error(error);
    });
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a PUT request to update the event
    axios.put(`http://localhost:8000/api/events/${id}/edit`, event, {
       withCredentials: true,
       headers: {
          Authorization: `Bearer ${token}`,
        },
     })

    .then((response) => {
      console.log(response.data); 
      navigate('/events');
    })
    .catch((err) => {
      console.log(err);
    //   const errorRes = err.response.data.err.errors;
    //   const errArr = [];
    //   console.log(errorRes);
    //   for (const key of Object.keys(errorRes)) {
    //     console.log(errorRes[key].message);
    //     errArr.push({ field: key, message: errorRes[key].message });
    //   }
    //   setErrors(errArr);
     });
};

  return (
    <div className="container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
            className="form-control"
            required
          />
          {errors.map((error) => error.field === 'title' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            className="form-control"
            required
          />
          {errors.map((error) => error.field === 'description' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={event.date}
            onChange={(e) => setEvent({ ...event, date: e.target.value })}
            className="form-control"
            required

          />
          {errors.map((error) => error.field === 'date' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={event.time}
            onChange={(e) =>setEvent({ ...event, time: e.target.value })}
            className="form-control"
            required
          />
          {errors.map((error) => error.field === 'time' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            className="form-control"
            required
          />
          {errors.map((error) => error.field === 'location' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            value={event.category}
            onChange={(e) => setEvent({ ...event, category: e.target.value })}
            className="form-control"
            required
          />
          {errors.map((error) => error.field === 'category' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <button type="submit" className="btn btn-primary">Update Event</button>
      </form>
    </div>
  );
};

export default UpdateEvent;
