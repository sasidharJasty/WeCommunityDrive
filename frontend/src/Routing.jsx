import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./Login"
import BarcodeScanner from './BarcodeScanner';
import Event from "./events";
import Hours from "./dashboard";
import Opportunities from "./Opportunities";
import EventDetails from './EventDetails';
import About from "./about";
import Programs from "./programs";
import Memberships from "./membership";


const Routing = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<App />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        
        <Route path="/hours" element={<Hours />} />
        <Route path="/orgevent" element={<Event />} />
        <Route path="/dashboard" element={<Hours />} />
        <Route path="/volunteer" element={<Opportunities />} />
        <Route path="/scan-barcode" element={<BarcodeScanner />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/membership" element={<Memberships />} />
      </Routes>
    </Router>
  );
};

export default Routing;