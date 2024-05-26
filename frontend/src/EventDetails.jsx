import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/04D2430AAFE10AA4/events/${eventId}`);
        setEventData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData();
  }, [eventId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Details for {eventId}</h1>
      {eventData ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Item</th>
              <th className="py-2 px-4 border-b">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object[0].entries(eventData).map(([item, quantity]) => (
              <tr key={item}>
                <td className="py-2 px-4 border-b">{item}</td>
                <td className="py-2 px-4 border-b">{quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading event data...</p>
      )}
    </div>
  );
};

export default EventDetails;
