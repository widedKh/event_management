import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { css } from '@emotion/react';
import { styled } from '@mui/system';

const titleStyle = css`
  background-color: #2196F3;
  color: white;
  padding: 10px;
  font-weight: bold;
  font-size: 20px;
`;

const TableHeader = styled(TableHead)`
  background-color: #2196F3;
  color: white;
`;


const ParticipatedEvents = () => {
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const token = localStorage.getItem("userToken");
  const userId = localStorage.getItem("user._id").replace(/"/g, "");

  useEffect(() => {
    console.log('Token:', token);
   

    axios
      .get(`http://localhost:8000/api/events/participated/${userId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const fetchedEvents = res.data.participatedEvents || [];
        setParticipatedEvents(fetchedEvents);
        console.log('Fetched Participated Events:', fetchedEvents);
      })
      .catch((err) => {
        console.error("Error fetching participated events:", err);
      });
  }, [userId, token]);

  return (
    <div>
      <div css={titleStyle}>
        <Typography variant="h4" gutterBottom>
          Participated Events
        </Typography>
      </div>
      {participatedEvents.length === 0 ? (
        <Typography variant="body1">
          No participated events to display.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Event Title</TableCell>
                <TableCell>Event Date</TableCell>
                <TableCell>Booking Date</TableCell>
                <TableCell>Ticket</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participatedEvents
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((ev) => (
                  <TableRow key={ev._id}>
                    <TableCell>
                      <Link to={`/events/${ev._id}`}>{ev.title}</Link>
                    </TableCell>
                    <TableCell>{new Date(ev.date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(ev.bookingDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                    <Link to={`/events/${ev._id}/${userId}/tickets`}>


                        Get Ticket
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default ParticipatedEvents;