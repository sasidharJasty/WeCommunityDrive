import { useState, useEffect } from 'react'
import debounce from 'lodash/debounce';
import reactLogo from './assets/react.svg'
import pattern from "./assets/pattern.png";
import viteLogo from '/vite.svg'
import Navbar from "./Components/Navbar"
import Spline from '@splinetool/react-spline';
import { TypeAnimation } from 'react-type-animation';
import useUserLocation from './Components/useUserLocation';
import autoAnimate from '@formkit/auto-animate'
import Reveal from "./Components/Reveal"
import Preloader from "./Components/PreLoader"
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
      console.error(error);
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
    <>
    <Preloader />
    <div className="bg-white">
      
      <img src={pattern} style={{ height: "100vh" }} className=" right-0 fixed" />

    <div className="container">
      <div className="text-box pt-20 typewriter  text-strt left-10">
        <Reveal >
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
        </Reveal>
        <Reveal>
            <h4 className="font-bold text-grey-500 ">Empower Others, Transform the World<br/> </h4>

            <p className="text-gray-400 w-2/5 ml-5 mt-5 mb-11">
            Experience seamless community engagement with WeCommunity! Our intuitive platform empowers organizers and volunteers to create and access drives effortlessly. Track event stats, manage schedules, and make impactful contributions—all in one user-friendly interface. Join us today and be part of a vibrant community dedicated to making a difference!            </p>
            </Reveal>
            <a className='ml-5 mt-10 btn rounded-lg px-20 py-3 text-bold hover:bg-white mt-20 ' href="#locations" >Get Started</a>
            
        </div>
    </div>
    <Navbar />
    <a id="locations"></a>

    <div class="container">
        <div classnName="text-box pt-20 typewriter  text-start left-10 ">
        <Reveal>
          <h1 className="Nice-green text-[5rem] font-black mr-[10vw]">
            Where Can YOU Donate?
          </h1>
          </Reveal>
        </div>
    </div>
    <div classnName="centered mt-[30vh]">
    <Reveal>

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
    </Reveal>

    </div>
    
    <div className="centered relative mb-[30vw]">

      <div className="absolute left-10 w-2/5 top-0 mt-0 scrollable-container">

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

  <div className="notifications-container rounded-3xl w-2/5 ml-72 border absolute left-96 top-0 border-4 border-green-200">
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
          <p>Start Time: {events[Index]?.Event_Time_Start} <br/>End time: {events[Index]?.Event_Time_End} <br/>Location: {events[Index]?.Event_Location}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

)} {events.length === 0  && (<h1 className='text-red-400 text-4xl text-center mt-[10vh]'>No Events Near You <br/> At this Time</h1>)}</div>
    </div>
    </>
  )
  
}

export default App