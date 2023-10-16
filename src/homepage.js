import React, { useState } from 'react';
import Sidenav from './navigation/Sidenav';
import Timeline from './timeline/Timeline';
import "./homepage.css";

import { setLoggedInUsername, getLoggedInUsername, setuserimg, getuserimg } from './user';


function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');  
  const [password, setpassword] = useState('');
  const [Rusername, setRUsername] = useState('');  
  const [Rpassword, setRpassword] = useState('');
  const [CRpassword, setCRpassword] = useState('');
  const [ setisRegistered] = useState(false);
  
  const [refreshTimeline, setRefreshTimeline] = useState(false);

  const reloadTimeline = () => {
    setRefreshTimeline(!refreshTimeline);
  };


  const handleRegister = async () => {
    if ((Rusername.trim() !== '' && Rpassword.trim() !== '') && (Rpassword === CRpassword)) {
      try {
        const response = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: Rusername,
            password: Rpassword,
            img: getuserimg(), // Use the getuserimg function from user.js
          }),
        });
  
        if (response.ok) {
          console.log('User registered successfully');
          setLoggedInUsername(Rusername);
          setisRegistered(true);
          setIsLoggedIn(true);
        } else {
          console.error('Failed to register user');
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  };
  
  
  const handleLogin = async() => {
    if (username.trim() !== '' && password.trim() !== '') {
      try {
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
  
        if (response.ok) {
          const responseData = await response.json(); // Parse the JSON response
          setuserimg(responseData.img); // Set the user image here
          setLoggedInUsername(username);
          setIsLoggedIn(true);
        } else {
          console.error('Failed to log in user');
        }
      } catch (error) {
        console.error('Error logging in user:', error);
      }
    }
  };

  
  return (
    <div className='homepage'>
      <div className="homepage__nav">
      {isLoggedIn && <Sidenav reloadTimeline={reloadTimeline} />}
            </div>
      <div className="homepage__timeline">
        {isLoggedIn ? (
          <Timeline />
        ) : (
          
          <div className="signin-form">
            <h2>Sign In</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
             <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <button onClick={handleLogin}>Log In</button>
            
            <h3>OR Sign up</h3>
            <input
              type="text"
              placeholder="Full Name/Username"
              value={Rusername}
              onChange={(e) => setRUsername(e.target.value)}
            />
             <input
              type="text"
              placeholder="Password"
              value={Rpassword}
              onChange={(e) => setRpassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Confirm Password"
              value={CRpassword}
              onChange={(e) => setCRpassword(e.target.value)}
            />
             <input
              type="text"
              placeholder="User image"
              onChange={(e) => setuserimg(e.target.value)}
            />
            <button onClick={handleRegister}>Register Now</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
