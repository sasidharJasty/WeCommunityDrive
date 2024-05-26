import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import "./hours.css";
import pattern from "./assets/pattern.png";

const Hours = () => {
  const [hours, setHours] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [resp, setResp] = useState([]);
  const [resp2, setResp2] = useState([""]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [popup1, setPopup1] = useState(false); // First popup state
  const [popup2, setPopup2] = useState(false); // Second popup state
  const [err, setErr] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState(""); // Missing status state

  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Username":"Login","Id":-999,"type":"Volunteer"}');
  const navigate = useNavigate();

  useEffect(() => {
    if (usrData.Id === -999) {
      navigate("/");
    } else {
      ren();
    }
  }, [usrData.Id, navigate]);

  const DateConverter = ({ dateString }) => {
    const dateObjectUTC = new Date(`${dateString}T24:00:00Z`);
    const dateObjectLocal = new Date(dateObjectUTC.toLocaleString());
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const formattedDate = dateObjectLocal.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const openPopup1 = (item) => {
    setSelectedItem(item);
    setStatus(item.approved ? "Approved" : item.denied ? "Denied" : "Pending");
    setPopup1(true);
  };

  const closePopup1 = () => {
    setSelectedItem(null);
    setPopup1(false);
  };

  const openPopup2 = () => {
    setPopup2(true);
  };

  const closePopup2 = () => {
    setPopup2(false);
  };

  async function ren() {
    try {
      const response2 = await axios.get(
        `http://127.0.0.1:8000/04D2430AAFE10AA4/events/`
      );
      setResp2(response2.data);
      console.log(response2.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <img src={pattern} style={{ height: "100vh" }} className="absolute z-50 right-0 img" />
      {isLoggedIn ? (
        <div className="flex justify-center content-center w-auto h-auto bg-white">
          <Navbar />
          <div className="w-full h-auto rounded-lg mx-5 my-12 grid grid-cols-2 mt-20 text-black">
            <h1 className="font-black absolute top-32 text-2xl left-10">Signed up Events</h1>
            <div className="absolute left-5 top-40 scrollable-container">
              {resp2.map((obj) => (
                <div key={obj.id} className="notification NotWidth mb-3">
                  <div className="notiglow"></div>
                  <div className="notiborderglow"></div>
                  <div className="notititle">{obj.Event_Name}</div>
                  <div className="notibody">{obj.Event_Description}</div>
                  <div className="notibody">{obj.Event_Location}, by {obj.Organization_Name}</div>
                </div>
              ))}
            </div>

            {/* First Popup */}
            {popup1 && (
              <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
                <div className="bg-white p-6 rounded-lg">
                  <h1 className="font-black text-lg">Details</h1>
                  <h2># of hours recorded: {selectedItem.hours}</h2>
                  <br />
                  <p>Work description: {selectedItem.work_description}</p>
                  <br />
                  <br />
                  <p className="flex">
                    Date: <DateConverter dateString={selectedItem.date} />
                  </p>
                  <p>Status: {status}</p>
                  <br />
                  <button onClick={closePopup1}>Close Popup</button>
                </div>
              </div>
            )}

            {/* Second Popup */}
            {popup2 && (
              <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
                <div className="bg-white p-6 rounded-lg">
                  <h1 className="font-black text-lg">Second Popup Content</h1>
                  <button onClick={closePopup2}>Close Popup</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        navigate("/UnAuth")
      )}
    </>
  );
};

export default Hours;
