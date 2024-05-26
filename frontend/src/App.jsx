import { useState, useEffect } from 'react'
import debounce from 'lodash/debounce';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from "./Components/Navbar"
import Spline from '@splinetool/react-spline';
import { TypeAnimation } from 'react-type-animation';
import useUserLocation from './Components/useUserLocation';
import autoAnimate from '@formkit/auto-animate'
import "./App.css"
import "./Login.css";
import "./events.css";

function App() {
  const [count, setCount] = useState(0);
  const [distance, setDistance] = useState(5);
  const [Distances, setDistances] = useState();
  const { userLocation, getUserLocation } = useUserLocation();
  const [Name, setName] = useState("");
  const [Goal, setGoal] = useState("");
  const [Location, setLocation] = useState("");
  const [opened, setOpened] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [Index, setIndex] = useState(0);
  const [resp, setResp] = useState([]);
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState("");
  const getNearby = async ( dist) => {
    try {
      
      const response = await fetch(`http://127.0.0.1:8000/04D2430AAFE10AA4/nearby/${userLocation.latitude}/${userLocation.longitude}/${dist}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setEvents(data["Events"])
      setDistances(data["Distances"])
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {

    if (Index > events.length-1 && Index !==0) {
      setIndex(events.length-1);
    }
  }, [Index, events.length]);


  useEffect(() => {
    if (userLocation !== null) {
      getNearby(5);
    }
  }, [userLocation]);

  const handleRange = (event) => {
    
    setDistance(Number(document.getElementById("range").value));

    if(userLocation !== null){
      getNearby(Number(document.getElementById("range").value));
    }
  } 


  return (
    <div className="bg-white">

    <div className="container">
    <div className="text-box pt-20 typewriter  text-strt left-10">
    <TypeAnimation
      sequence={[
        'WeCommunity',
        900,
        "Let's Volunteer",
        900,
        'Donate',
        900,   
        'Support others',
        900,
        'Make a difference',
        900
      ]}
      wrapper="span"
      speed={50}
      style={{ }}
      repeat={Infinity}
    />
            <h4 className="font-bold text-grey-500 ">Empower Others, Transform the World<br/> </h4>
            <p className="text-gray-400 w-2/5 ml-5 mt-5 mb-11">
            Experience seamless community engagement with WeCommunity! Our intuitive platform empowers organizers and volunteers to create and access drives effortlessly. Track event stats, manage schedules, and make impactful contributions—all in one user-friendly interface. Join us today and be part of a vibrant community dedicated to making a difference!            </p>
            <a className='ml-5 mt-10 btn rounded-lg px-20 py-3 text-bold hover:bg-white mt-20 ' href="#locations" >Get Started</a>
        </div>
    </div>
    <Navbar />
    <div className="fixed z-[0] right-0 top-0" > <svg  className='h-screen z-0' id="visual" viewBox="0 0 450 900" width="366" height="900" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M160 900L171.3 875C182.7 850 205.3 800 211 750C216.7 700 205.3 650 204.8 600C204.3 550 214.7 500 213.7 450C212.7 400 200.3 350 187.8 300C175.3 250 162.7 200 158.5 150C154.3 100 158.7 50 160.8 25L163 0L450 0L450 25C450 50 450 100 450 150C450 200 450 250 450 300C450 350 450 400 450 450C450 500 450 550 450 600C450 650 450 700 450 750C450 800 450 850 450 875L450 900Z" fill="#67c5b1"></path><path d="M249 900L249.8 875C250.7 850 252.3 800 253.7 750C255 700 256 650 246.8 600C237.7 550 218.3 500 214.3 450C210.3 400 221.7 350 234.7 300C247.7 250 262.3 200 265.7 150C269 100 261 50 257 25L253 0L450 0L450 25C450 50 450 100 450 150C450 200 450 250 450 300C450 350 450 400 450 450C450 500 450 550 450 600C450 650 450 700 450 750C450 800 450 850 450 875L450 900Z" fill="#54b8a2"></path><path d="M292 900L292.3 875C292.7 850 293.3 800 285 750C276.7 700 259.3 650 257.2 600C255 550 268 500 279.7 450C291.3 400 301.7 350 301.5 300C301.3 250 290.7 200 286.7 150C282.7 100 285.3 50 286.7 25L288 0L450 0L450 25C450 50 450 100 450 150C450 200 450 250 450 300C450 350 450 400 450 450C450 500 450 550 450 600C450 650 450 700 450 750C450 800 450 850 450 875L450 900Z" fill="#3fac92"></path><path d="M307 900L308.3 875C309.7 850 312.3 800 321.2 750C330 700 345 650 346.2 600C347.3 550 334.7 500 328.2 450C321.7 400 321.3 350 321.7 300C322 250 323 200 327.7 150C332.3 100 340.7 50 344.8 25L349 0L450 0L450 25C450 50 450 100 450 150C450 200 450 250 450 300C450 350 450 400 450 450C450 500 450 550 450 600C450 650 450 700 450 750C450 800 450 850 450 875L450 900Z" fill="#28a083"></path><path d="M393 900L390.2 875C387.3 850 381.7 800 378.8 750C376 700 376 650 373 600C370 550 364 500 364.8 450C365.7 400 373.3 350 378.5 300C383.7 250 386.3 200 383.8 150C381.3 100 373.7 50 369.8 25L366 0L450 0L450 25C450 50 450 100 450 150C450 200 450 250 450 300C450 350 450 400 450 450C450 500 450 550 450 600C450 650 450 700 450 750C450 800 450 850 450 875L450 900Z" fill="#009473"></path></svg></div>
    <a id="locations"></a>
    <div class="container">
        <div classnName="text-box pt-20 typewriter  text-start left-10 ">
          <h1 className="Nice-green text-[5rem] font-black mr-[10vw]">
            Where Can YOU Donate?
          </h1>
        </div>
    </div>
    <div classnName="centered mt-[50vh]">

    <div class="centered !mb-0">
      <label for="range" class="nostyle">Events within </label>
      <select name="range" id="range" onChange={handleRange}>
        <option value="5">5 miles</option>
        <option value="15">15 miles</option>
        <option value="25">25 miles</option>
        <option value="50">50 miles</option>
      </select>
      <label for="range" class="nostyle"></label>
    </div>

    </div>
    <div className="centered relative mb-[40vw]">
      <div className="absolute left-10 w-2/5 top-20 mt-20 scrollable-container">
        {events.map((obj, key) => (
          <div className="notification mb-3 border border-4 border-green-200" onClick={(e) => setIndex(key)} key={key}>
            <div className="notiglow"></div>
            <div className="notiborderglow"></div>
            <div className="notititle">{obj["Event_Name"]}</div>
            <div className="notibody">{obj["Event_Description"]}</div>
            <div className="notibody">{obj["Event_Goal"]}</div>
            <div className="notibody">{obj["Event_Location"]}</div>
          </div>
        ))}
      </div>

      {events !== null && events !== undefined && events[Index] && (
  <div className="notifications-container rounded-3xl w-2/5 ml-72 border absolute left-96 top-36 border-4 border-green-200">
    <div className="success">
      <div className="flex">
        <div className="flex-shrink-0"></div>
        <div className="success-prompt-wrap">
          <p className="success-prompt-heading text-5xl">{events[Index]?.Event_Name}</p>
          <div className="success-prompt-prompt text-xl font-bold">
            <p>Goal: {events[Index]?.Event_Goal}</p>
          </div>
          <div className="success-prompt-prompt text-lg mb-3">
            <p>Description: {events[Index]?.Event_Description}</p>
          </div>
          <div className="success-prompt-prompt mb-3 font-bold">
            <p>{events[Index]?.Event_Time_Start} till {events[Index]?.Event_Time_End} @ {events[Index]?.Event_Location}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)} {events.length === 0  && (<h1 className='text-red-400 text-4xl text-center mt-[10vw]'>No Events Near You <br/> At this Time</h1>)}</div>
    </div>
  )
}

export default App