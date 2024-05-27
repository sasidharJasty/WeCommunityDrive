import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from "./Components/Navbar";
import { useNavigate } from "react-router-dom";

const EventDetails = () => {
  const { eventId } = useParams();
  const [eventItems, setEventItems] = useState(null);
  const [Popup, setPopup] = useState(false);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState("");
  const [token, setToken] = useState(""); // State for authorization token
  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Username":"Login","Id":-999,"type":"Volunteer"}');
  const navigate = useNavigate();

  useEffect(() => {
    if (usrData.Id === -999) {
      navigate("/");
    };
  }, [usrData.Id, navigate]);
  const fetchEventData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/04D2430AAFE10AA4/events/${eventId}`);
      console.log('Response data:', response.data); // Log the entire response
      let eventString = response.data.event;
      setName(response.data.name);

      // Convert single quotes to double quotes
      eventString = eventString.replace(/'/g, '"');

      const eventItems = JSON.parse(eventString); // Parse the corrected event string
      setEventItems(eventItems);
      console.log('Parsed event items:', eventItems); // Log the parsed event items
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  useEffect(() => {
    

    fetchEventData();
  }, [eventId]);

  // Function to handle adding items
  async function AddItem() {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/04D2430AAFE10AA4/add_item/${eventId}/${item.toLowerCase()}/${quantity}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log('YourEvents:', response.data);
      fetchEventData();
      setPopup(false); 
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

  if (!eventItems) {
    return <p>Loading event data...</p>;
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <NavBar />
      <div className="flex w-[80vw] ml-[10vw] mb-[10vh] mt-[25vh]">
      <h1 className="text-2xl font-bold mb-2 mr-20">Event Details for {name}</h1>
      <button className=" px-3 mr-40 py-2 btn-txt rounded-xl " onClick={() => setPopup(true)}>Add Items +</button>
      <button className="m-auto mt-[5vh] w-1/4 button ml-5 text-center " onClick={()=>history("/scan-barcode")}>
          Scan
        </button>
      </div>
      <table className="w-[80vw] ml-[10vw] bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Item</th>
            <th className="py-2 px-4 border-b">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(eventItems).map(([item, quantity]) => (
            <tr key={item} className=''>
              <td className="py-2 px-4 border-b">{item}</td>
              <td className="py-2 px-4 border-b">{quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={`main2 left-[80vw] absolute w-11/12 mt-10 ${Popup ? '' : 'hidden'}`}>
        <label className="text-black">Add an Item</label>
        <input
          className="py-5 m-auto mb-5 mt-20 placeholder-black"
          type="text"
          name="text"
          value={item}
          placeholder="Item"
          required=""
          onChange={(e) => setItem(e.target.value)}
        />
        <input
          className="py-5 m-auto mb-5 placeholder-black"
          type="number"
          name="text"
          value={quantity}
          placeholder="Quantity"
          required=""
          onChange={(e) => setQuantity(e.target.value)}
        />
        
        <button className="m-auto mt-[5vh] w-1/4 button ml-5" onClick={AddItem}>
          Submit
        </button>
        <button className="m-auto mt-[5vh] w-1/4 button ml-5 bg-red-400 !border-red-400 text-white hover:!text-red-400" onClick={() => setPopup(false)}>
          Close
        </button>
        
      </div>
    </div>
  );
};

export default EventDetails;
