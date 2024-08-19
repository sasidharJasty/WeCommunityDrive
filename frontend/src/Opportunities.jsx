import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png";
import "./Login.css";
import "./events.css";

export default function Opportunities() {
  const usrData = JSON.parse(
    localStorage.getItem("Data") ||
      '{"User":"Login","Username":"Login","Id":-999,"type":"Volunteer"}'
  );
  const [selectedOrg, setSelectedOrg] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [opened, setOpened] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [Index, setIndex] = useState(0);
  const [resp, setResp] = useState([]);
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState("");
  const history = useNavigate();

  async function EventSubmit() {
    try {
      const token = localStorage.getItem("token");
      const response2 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/event/signup/` +
          usrData["User"] +
          `/` +
          (Index + 1) +
          `/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      alert("Signed up for " + events[Index].Event_Name);
    } catch (error) {}
  }

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      const response2 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/events/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setEvents(response2.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (usrData["Id"] === -999) {
      history("/");
    }

    fetchData();
  }, []);

  const handleEvent = async (e) => {
    e.preventDefault();

    if (
      !selectedOrg ||
      !name ||
      !description ||
      !restrictions ||
      !location ||
      !date
    ) {
      setErr("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/orgevent/`,
        {
          user_id: usrData.Id,
          Organization_Name: selectedOrg,
          Event_Name: name,
          Event_Description: description,
          Event_Restrictions: restrictions,
          Event_Location: location,
          Event_Time: date,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      fetchData();
      setErr("");
    } catch (error) {
      console.log(error);
      setErr("Error occurred while signing up event.");
    }
  };

  return (
    <>
      <img
        src={pattern}
        style={{ height: "100vh" }}
        className="absolute right-0"
      />
      <h1 className="green-txt absolute text-3xl font-black ml-10 mt-5 left-40 top-20">
        {" "}
        Opportunities
      </h1>
      <div className="absolute left-10 w-2/5 top-20 mt-20 scrollable-container">
        {events.map((obj, key) => (
          <div
            className="notification mb-3 border border-4 border-green-200"
            onClick={(e) => setIndex(key)}
            key={key}
          >
            <div className="notiglow"></div>
            <div className="notiborderglow"></div>
            <div className="notititle">{obj["Event_Name"]}</div>
            <div className="notibody">{obj["Event_Description"]}</div>
            <div className="notibody">
              {obj["Event_Location"]}, by {obj["Organization_Name"]}
            </div>
          </div>
        ))}
      </div>

      {events !== null && events !== undefined && events[Index] && (
        <div className="notifications-container rounded-3xl w-2/5 ml-72 border absolute left-96 top-36 border-4 border-green-200">
          <div className="success">
            <div className="flex">
              <div className="flex-shrink-0"></div>
              <div className="success-prompt-wrap">
                <p className="success-prompt-heading text-5xl">
                  {events[Index]?.Event_Name}
                </p>
                <div className="success-prompt-prompt text-xl font-bold">
                  <p>Goal: {events[Index]?.Event_Goal}</p>
                </div>
                <div className="success-prompt-prompt text-lg mb-3">
                  <p>Hosted By: {events[Index]?.Username}</p>
                </div>
                <div className="success-prompt-prompt text-lg mb-3">
                  <p>Description: {events[Index]?.Event_Description}</p>
                </div>
                <div className="success-prompt-prompt text-lg mb-3">
                  <p># of Participants: {events[Index]?.Volunteers.length}</p>
                </div>
                <div className="success-prompt-prompt mb-3 font-bold">
                  <p>
                    Start Time: {events[Index]?.Event_Time_Start} <br />
                    End time: {events[Index]?.Event_Time_End} <br />
                    Location: {events[Index]?.Event_Location}
                  </p>
                </div>
                <div className="success-button-container ml-[400px]">
                  <button
                    type="button"
                    className="success-button-main bg-green-400 mr-5"
                    onClick={() => history("/event/" + (Index + 1))}
                  >
                    Visit
                  </button>
                  <button
                    type="button"
                    className="success-button-main bg-green-400"
                    onClick={(e) => EventSubmit(e)}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </>
  );
}
