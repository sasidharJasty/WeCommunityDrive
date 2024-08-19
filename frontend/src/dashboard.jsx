import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import useUserLocation from "./Components/useUserLocation";
import "./hours.css";
import pattern from "./assets/pattern.png";

const Hours = () => {
  const [resp, setresp] = useState([]);
  const [resp2, setresp2] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [distance, setDistance] = useState(5);
  const { userLocation, getUserLocation } = useUserLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signedUpEvents, setsignedUpEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [err, seterr] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const usrData = JSON.parse(
    localStorage.getItem("Data") ||
      '{"User":"Login","Age":0,"Username":"Login","Id":-999,"type":"Volunteer"}'
  );
  const history = useNavigate();

  if (usrData["Id"] === -999) {
    history("/");
  }

  const isUserRegistered = (event) => {
    return (
      event.participants &&
      Array.isArray(event.participants) &&
      event.participants.includes(usrData["Id"])
    );
  };

  const usersDict = resp.reduce((acc, user) => {
    acc[user.id] = user.username;
    return acc;
  }, {});

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
      for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(
            cookies[i].substring(name.length + 1)
          );
          break;
        }
      }
    }
    return cookieValue;
  }

  async function EventSubmit(id) {
    try {
      const token = localStorage.getItem("token");
      const csrfToken = getCookie("csrftoken");

      const response2 = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/registerevent/`,
        {
          user_id: usrData["Id"],
          event_id: id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "X-CSRFToken": csrfToken,
          },
        }
      );
      alert(response2.data.message);
      fetchData();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        alert("You have already signed up for that event");
      } else {
        alert(error);
      }
    }
  }

  const getNearby = async (dist) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/nearby/${
          userLocation.latitude
        }/${userLocation.longitude}/${dist}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setEvents(data["Events"]);
      setDistance(data["Distances"]);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");

      const participantsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}04D2430AAFE10AA4/participants/${
          usrData["Id"]
        }/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setParticipants(participantsResponse.data);
      console.log(participantsResponse.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchData();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation !== null) {
      getNearby(5);
    }
    setLoading(false);
  }, [userLocation]);

  const handleRange = (event) => {
    setDistance(Number(document.getElementById("range").value));

    if (userLocation !== null) {
      getNearby(Number(document.getElementById("range").value));
    }
  };

  return (
    <>
      <img
        src={pattern}
        style={{ height: "100vh" }}
        className="absolute top-0 z-50  right-0 img"
      />
      <Navbar />
      <div className="w-screen h-screen bg-[--background] overflow-hidden flex">
        <div className="w-1/3 mt-[10vh]">
          <div className="inline">
            <label htmlFor="range" className="nostyle text-white">
              Events within{" "}
            </label>
            <select
              name="range"
              className="mx-auto text-center text-[1vw] ml-[40%] mt-[2vh]"
              id="range"
              onChange={handleRange}
            >
              <option value="5">5 miles</option>
              <option value="15">15 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
            </select>
            <label htmlFor="range" className="nostyle mx-auto"></label>
          </div>
          <div className="relative mb-[10vw]">
            <div className="ml-[1vw] w-screen !h-[30vw] scrollable-container">
              {loading ? (
                <div className="loading-spinner ml-40">Loading events...</div>
              ) : events.length > 0 ? (
                events.map((obj, key) => (
                  <div
                    className="notification mb-3 border border-4 border-white relative"
                    key={key}
                  >
                    <div className="notiglow"></div>
                    <div className="notiborderglow"></div>
                    <div className="notititle">{obj["Event_Name"]}</div>
                    <div className="notibody">{obj["Event_Description"]}</div>

                    <div className="notibody flex">
                      {obj["Event_Location"]}
                      {!isUserRegistered(events[key]) ? (
                        <div className="ml-[20%]">
                          <button
                            type="button"
                            className=" px-[0.5vw] py-[0.5vh] rounded-[0.5vw] bg-green-400 text-white"
                            onClick={(e) => EventSubmit(obj["id"])}
                          >
                            Register
                          </button>
                        </div>
                      ) : (
                        <div className="success-button-container ml-[20%] text-red-600 font-black">
                          <p>You are already registered for this event.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-events text-gray-500 ml-40">
                  No events near you at this time.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-1/3 ml-[10vw] mt-[10vh]">
          <div className="inline">
            <label htmlFor="range" className="nostyle text-black mt-[6vh] ">
              Signed Up Events:{" "}
            </label>
          </div>
          <div className=" relative mt-[2vh]">
            {participants["events_participated"] &&
            participants["events_participated"].length > 0 ? (
              <div className="ml-[1vw] w-screen !h-[30vw] scrollable-container">
                {participants["events_participated"].map((obj, key) => (
                  <div
                    className="notification mb-3 border border-4 border-white"
                    key={key}
                  >
                    <div className="notiglow"></div>
                    <div className="notiborderglow"></div>
                    <div className="notititle">{obj["Event_Name"]}</div>
                    <div className="notibody">{obj["Event_Description"]}</div>
                    <div className="notibody flex relative">
                      {obj["Event_Location"]} @<br /> {obj["Event_Time_Start"]}{" "}
                      to {obj["Event_Time_End"]}
                      <button
                        type="button"
                        className="success-button-main absolute bottom-[1vh] right-[1vw] bg-green-400 mr-5 px-[1vw]"
                        onClick={() => history("/event/" + obj["id"])}
                      >
                        Visit Items
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-events w-full h-full flex items-center justify-center text-gray-500">
                No events participated yet.
                <br /> Sign Up for one on the left
              </div>
            )}
          </div>{" "}
        </div>
      </div>
    </>
  );
};

export default Hours;
