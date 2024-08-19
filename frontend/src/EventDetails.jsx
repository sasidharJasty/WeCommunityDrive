import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "./Components/Navbar";
import { useNavigate } from "react-router-dom";

const EventDetails = () => {
  const { eventId } = useParams();
  const [eventItems, setEventItems] = useState(null);
  const [popup, setPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("Quantity");
  const [editItemName, setEditItemName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState(""); // State for authorization token
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const usrData = JSON.parse(
    localStorage.getItem("Data") ||
      '{"User":"Login","Username":"Login","Id":-999,"type":"Volunteer"}'
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (usrData.Id === -999) {
      navigate("/");
    }
  }, [usrData.Id, navigate]);

  const fetchEventData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/events/${eventId}`
      );
      console.log("Response data:", response.data); // Log the entire response
      let eventString = response.data.event;
      setName(response.data.name);

      // Convert single quotes to double quotes
      eventString = eventString.replace(/'/g, '"');

      const eventItems = JSON.parse(eventString); // Parse the corrected event string
      setEventItems(eventItems);
      console.log("Parsed event items:", eventItems); // Log the parsed event items
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  // Function to handle adding items
  async function addItem() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/add_item/`,
        {
          event_id: eventId,
          item: item.toLowerCase(),
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log("YourEvents:", response.data);
      fetchEventData();
      setPopup(false);
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  }

  // Function to handle editing items
  async function editItem() {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/edit_item/`,
        {
          event_id: eventId,
          item: editItemName.toLowerCase(),
          quantity: editQuantity,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log("EditResponse:", response.data);
      fetchEventData();
      setEditPopup(false);
    } catch (error) {
      console.error("Error editing item:", error);
      throw error;
    }
  }

  // Function to handle deleting items
  async function deleteItem(itemName) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/delete_item/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          data: {
            event_id: eventId,
            item: itemName.toLowerCase(),
          },
        }
      );

      console.log("DeleteResponse:", response.data);
      fetchEventData();
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  }

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Function to dynamically sort items
  const sortedItems = () => {
    const sortableItems = Object.entries(eventItems || {});
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  if (!eventItems) {
    return <p>Loading event data...</p>;
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <NavBar />
      <div className=" w-[80vw] ml-[10vw] mb-[5vh] mt-[12vh]">
        <h1 className="text-2xl font-bold mb-2 mr-20 text-center">
          Donated Items for {name}
        </h1>
        <div className="flex mx-auto w-fit">
          <button
            className=" m-auto mt-[5vh] w-[20vw] btn-txt rounded-xl py-1 ml-5 text-center  "
            onClick={() => setPopup(true)}
          >
            Add Items +
          </button>
        </div>
      </div>
      <table className="w-[80vw] ml-[10vw] mb-[10vh] bg-white border border-gray-200">
        <thead>
          <tr>
            <th
              className="py-2 px-4 border-4  border-[#00c99d] cursor-pointer"
              onClick={() => requestSort("0")}
            >
              Item{" "}
              {sortConfig.key === "0" && (
                <span>{sortConfig.direction === "ascending" ? "▲" : "▼"}</span>
              )}
            </th>
            <th
              className="py-2 px-4 border-4 w-[15vw]  border-[#00c99d] cursor-pointer"
              onClick={() => requestSort("1")}
            >
              Quantity{" "}
              {sortConfig.key === "1" && (
                <span>{sortConfig.direction === "ascending" ? "▲" : "▼"}</span>
              )}
            </th>
            <th className="py-2 px-4 border-4 border-[#00c99d] w-[13vw]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedItems().map(([itemName, quantity]) => (
            <tr key={itemName} className="">
              <td className="py-2 px-4 border-b text-center bg-[#00c99d96]">
                {itemName}
              </td>
              <td className="py-2 px-4 border-b text-center bg-[#00c99d96]">
                {quantity}
              </td>
              <td className="py-2  px-4 border-b text-center flex bg-[#00c99d96]">
                <button
                  className="mr-2 button w-fit px-[1vw] mt-0 mb-0"
                  onClick={() => {
                    setEditItemName(itemName);
                    setEditQuantity(quantity);
                    setEditPopup(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="button bg-red-400 !border-red-400 mt-0 mb-0 text-white w-fit px-[1vw] hover:!text-red-400"
                  onClick={() => deleteItem(itemName)}
                >
                  &#x232B;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popup && (
        <div className="main2 w-[80vw] left-[50vw] top-[50vh] absolute">
          <label className="text-black">Add an Item</label>
          <label className="text-black m-0 p-0 text-left">Item:</label>
          <input
            className="py-5 m-auto mb-5 mt-0 placeholder-black"
            type="text"
            name="text"
            value={item}
            placeholder="Item Name"
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
          <div className="flex mx-auto">
            <button className="mt-[5vh] w-1/4 button mr-1" onClick={addItem}>
              Submit
            </button>
            <button
              className="mt-[5vh] w-1/4 button ml-1 bg-red-400 !border-red-400 text-white hover:!text-red-400"
              onClick={() => setPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editPopup && (
        <div className="main2 w-[80vw] left-[50vw] top-[50vh] absolute">
          <label className="text-black">Edit an Item</label>
          <label className="text-black m-0 p-0 text-left">Item:</label>
          <input
            className="py-5 m-auto mb-5 mt-0 placeholder-black"
            type="text"
            name="text"
            value={editItemName}
            placeholder="Item Name"
            readOnly
          />
          <input
            className="py-5 m-auto mb-5 placeholder-black"
            type="number"
            name="text"
            value={editQuantity}
            placeholder="Quantity"
            required=""
            onChange={(e) => setEditQuantity(e.target.value)}
          />
          <div className="flex mx-auto">
            <button className="mt-[5vh] w-1/4 button mr-1" onClick={editItem}>
              Submit
            </button>
            <button
              className="mt-[5vh] w-1/4 button ml-1 bg-red-400 !border-red-400 text-white hover:!text-red-400"
              onClick={() => setEditPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
