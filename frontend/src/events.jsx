import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png";
import "./Login.css";
import "./events.css";

export default function Event() {
  const usrData = JSON.parse(
    localStorage.getItem("Data") ||
      '{"User":"Login","Username":"Login","Id":-999,"type":"Volunteer"}'
  );
  const [selectedOrg, setSelectedOrg] = useState("");
  const [popup, setPopup] = useState(false);
  const [Index, setIndex] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setgoal] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [resp, setResp] = useState([]);
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState("");
  const history = useNavigate();

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      const YourEvents = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/events/?user_id=${
          usrData.Id
        }`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setEvents(YourEvents.data);
      console.log(YourEvents.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (usrData["userType"] !== "Organizer") {
      /* Stop people who are not organizers from making events */
      history("/");
    }

    fetchData();
  }, []);

  const handleEvent = async (e) => {
    e.preventDefault();

    if (!name || !description || !goal || !location || !date) {
      setErr("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/orgevent/`,
        {
          user_id: usrData["Id"],
          Username: usrData["User"],
          Event_Name: name,
          Event_Description: description,
          Event_Goal: goal,
          Event_Location: location,
          Event_Time_Start: date,
          Event_Time_End: enddate,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      fetchData();
      setPopup(false);
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
        className="absolute right-0 top-0"
      />
      <h1 className="green-txt absolute text-3xl font-black ml-10 mt-5 left-40 top-20">
        {" "}
        Your Events
      </h1>
      <button
        className="flex px-3 mr-40 py-2 btn-txt rounded-xl absolute ml-80 mt-5 left-40 top-20"
        onClick={() => setPopup(true)}
      >
        Create +
      </button>
      <div className="absolute left-10 w-2/5 top-20 mt-20 scrollable-container">
        {events.map((obj, key) => (
          <div
            class="notification mb-3 "
            onClick={(e) => setIndex(key)}
            key={key}
          >
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">{obj["Event_Name"]}</div>
            <div class="notibody">{obj["Event_Description"]}</div>
            <div class="notibody">
              {obj["Event_Location"]}, by {obj["Username"]}
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
                <button
                  type="button"
                  className="success-button-main bg-green-400 mr-5"
                  onClick={() => history("/event/" + (Index + 1))}
                >
                  View Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {events.length === 0 && (
        <h1 className="text-red-400 text-4xl text-center mt-[10vw]">
          No Events Created
        </h1>
      )}
      <div
        className={`main2 left-[50vw] -bottom-[20vh] absolute w-11/12 mt-10 ${
          popup ? "" : "hidden"
        }`}
      >
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="signup">
          <form onSubmit={handleEvent} className="mb-20 form">
            <label className="text-black">Create an Event</label>

            <p className="text-red-600 font-bold text-center mb-5">{err}</p>
            <div className="flex w-full mt-[10vh] justify-around">
              <div className="w-[40vw]">
                <input
                  className="py-5 m-auto mb-5 placeholder-black"
                  enterkeyhint="next"
                  type="text"
                  name="text"
                  value={name}
                  placeholder="Event Name"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="py-5 m-auto mb-5 placeholder-black"
                  type="text"
                  name="description"
                  value={description}
                  placeholder="Event Description"
                  required
                  enterkeyhint="next"
                  rows={5}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  className="py-5 m-auto mb-5 placeholder-black"
                  type="text"
                  name="Goal"
                  value={goal}
                  placeholder="Event Goal"
                  required
                  onChange={(e) => setgoal(e.target.value)}
                />
                <input
                  className="py-5 m-auto mb-5 placeholder-black"
                  type="street_address"
                  name="street_address"
                  value={location}
                  placeholder="Event Location"
                  autocomplete="street-address"
                  enterkeyhint="next"
                  required
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="w-[40vw]">
                <label className="placeholder-black !text-[1.2vw] mt-0 font-semibold text-black">
                  Event Start Time
                </label>
                <input
                  className="py-5 m-auto mb-5 placeholder-black"
                  type="datetime-local"
                  name="pswd"
                  value={date}
                  placeholder="Event Time"
                  required
                  enterkeyhint="next"
                  rows={5}
                  onChange={(e) => setDate(e.target.value)}
                />
                <label className="placeholder-black !text-[1.2vw] mt-0 font-semibold text-black">
                  Event End Time
                </label>
                <input
                  className="py-5 m-auto mb-5 placeholder-black"
                  type="datetime-local"
                  name="pswd"
                  value={enddate}
                  placeholder="Event Time"
                  required
                  enterkeyhint="done"
                  rows={5}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full ">
              <div className="flex w-1/4 ml-[35vw]">
                <button className="m-auto mt-[5vh] mr-5 button" type="submit">
                  Post Event
                </button>
                <button
                  className="m-auto mt-[5vh] button ml-5 bg-red-400 !border-red-400 text-white hover:!text-red-400"
                  onClick={() => setPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Navbar />
    </>
  );
}
