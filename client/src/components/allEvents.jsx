import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllEvents = () => {
  //const userName = JSON.parse(localStorage.getItem("name"));
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]); 
  function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    

  useEffect(() => {
    // Fetch events based on the selected category
    axios.get(`http://localhost:8000/api/events`)
      .then(res => {
        let filteredEvents = res.data.allEvents;

        // Filter events by category if a category is selected
        if (selectedCategory !== 'All') {
          filteredEvents = res.data.allEvents.filter(event => event.category === selectedCategory);
        }

        const currentDate = new Date(); // Get the current date
       filteredEvents = filteredEvents.filter(event => new Date(event.date) > currentDate);

        setEvents(filteredEvents);

        // Extract unique category values from the data
        const uniqueCategories = [...new Set(res.data.allEvents.map(event => event.category))];
        setCategories(['All', ...uniqueCategories]);
      })
      .catch(err => {
        console.log('An error occurred', err);
      });
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div>
      <div>
        <h4>Upcoming Events</h4>
      </div>

      <label>Select a category:</label>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <div className='event-card-container'>
        {events.map((e) => (
          <div key={e._id} className='event-card' style={{ backgroundColor: getRandomColor() }}>
            <div className="event-card-details">
              <Link to={`/events/${e._id}`}>
                <h2>{e.title}</h2>
                <p>{new Date(e.date).toLocaleDateString()}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEvents;



// {/* // import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {Link} from 'react-router-dom';


// const AllEvents = () => { */}
//   const userName= JSON.parse(localStorage.getItem("name"));
//   const [events, setEvents] = useState([]);
//   function getRandomColor() {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }


//   useEffect(() => {
//     axios.get('http://localhost:8000/api/events')
//       .then(res => {
//         setEvents(res.data.allEvents);
//       })
//       .catch(err => {
//         console.log('An error occurred', err);
//       });
//   }, []); 


//   return (
//     <div>
//       <div><h4>Welcome,{userName}</h4></div>
//       <div className='event-card-container'>
//       {events.map((e) => (
//         <div key={e._id} className='event-card' style={{ backgroundColor: getRandomColor() }}>
//           <div className="event-card-details">
//             <Link to={`/events/${e._id}`}>
//                <h2>{e.title}</h2>
//                 <p>{e.date}</p>
//             </Link>
          
//           </div>
//         </div>
//       ))}
//       </div>
//     </div>
//   );
// };

// export default AllEvents;


// {/* <script>
//   const categoryFilter = document.getElementById("category-filter");
//   const eventList = document.getElementById("event-list");

//   // Event listener for category filter change
//   categoryFilter.addEventListener("change", async () => {
//     const selectedCategory = categoryFilter.value;

//     // Fetch events from the backend based on the selected category
//     const response = await fetch(`/api/events?category=${selectedCategory}`);
//     const events = await response.json();

//     // Update the event list with the filtered events
//     eventList.innerHTML = ""; // Clear existing events
//     events.forEach((event) => {
//       // Append event details to the eventList container
//     });
//   });
// </script> */}

