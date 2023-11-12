import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HostEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      date,
      time,
      location,
      category,
    };

    localStorage.getItem("userToken");
    axios.post('http://localhost:8000/api/event/new', eventData, {
      withCredentials: true
    })
      .then((response) => {
        console.log(response.data);
        console.log(localStorage.getItem("userToken"));
        navigate('/events');
      })
      .catch((err) => {
        console.log(err);
        const errorRes = err.response.data.err.errors;
        const errArr = [];
        console.log(errorRes);
        for (const key of Object.keys(errorRes)) {
          console.log(errorRes[key].message);
          errArr.push({ field: key, message: errorRes[key].message });
        }
        setErrors(errArr);
      });
  };

  return (
    <div className="container">
      <h2>Host an Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
          {errors.map((error) => error.field === 'title' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
          {errors.map((error) => error.field === 'description' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />
          {errors.map((error) => error.field === 'date' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-control"
          />
          {errors.map((error) => error.field === 'time' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
          />
          {errors.map((error) => error.field === 'location' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control"
          />
          {errors.map((error) => error.field === 'category' && (
            <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
          ))}
        </div>
        <button type="submit" className="btn btn-primary">Host Event</button>
      </form>
    </div>
  );
};

export default HostEvent;



  
    