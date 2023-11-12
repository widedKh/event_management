//import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {

  const navigate = useNavigate(); 
  const token = localStorage.getItem('token');
  const userName = JSON.parse(localStorage.getItem("name"));

  const logout = () => {
    axios.post("http://localhost:8000/api/logout", { withCredentials: true })
      .then(res => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("user");
        console.log(res);
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      });
  };



  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <Link to="/event/new">Host an Event</Link>
        </li>
        <li>
          <Link to="/events/participated">Participated Events</Link>
        </li>
        <li>
          <Link to="/events">All Events</Link>
        </li>
        <li>
          <Link to="/myevents">Your Events</Link>
        </li>
        {token ? (
          <li>
            <Link onClick={logout} to="/">
              Logout
            </Link>
          </li>
        ) : null}
      </ul>

      <div className="user-info">
        {userName}
      </div>
    </nav>
  );
};

export default Navbar;
