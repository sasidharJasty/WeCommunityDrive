import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Event from './events';
import Scanner from './S2.jsx'; // Adjust path based on your file structure
import Hours from './dashboard';
import Opportunities from './Opportunities';
import EventDetails from './EventDetails';
import About from './about';
import Programs from './programs';
import Memberships from './membership';

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/hours" element={<Hours />} />
        <Route path="/orgevent" element={<Event />} />
        <Route path="/dashboard" element={<Hours />} />
        <Route path="/volunteer" element={<Opportunities />} />
        {/* Use element prop for rendering Scanner component */}
        <Route path="/scan-barcode" element={<Scanner />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/membership" element={<Memberships />} />
      </Routes>
    </Router>
  );
};

export default Routing;
