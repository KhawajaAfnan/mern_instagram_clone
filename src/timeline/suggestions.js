import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./suggestions.css";
import { getLoggedInUsername } from '../user'; // Assuming you have a function to get the logged-in username

function Suggestions() {
  const [suggestedUsers, setsuggestedUsers] = useState([]);
  const loggedInUsername = getLoggedInUsername(); // Get the logged-in username

  useEffect(() => {
    // Fetch suggested users from your backend API
    fetch('http://localhost:3001/suggestions', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setsuggestedUsers(data.data); // Update the state
       // console.log('Suggested users:', suggestedUsers);

      })
      .catch(error => {
        console.error('Error fetching suggested users:', error);
      });
  }, []);

  return (
    <div className="suggestions">
    <div className="suggestions__header">
    <div className="suggestions__title">Suggestions for you</div>    </div>
    <div className="suggestions__list">
      {suggestedUsers && Array.isArray(suggestedUsers) ? (
        suggestedUsers
          .filter(user => user.username !== loggedInUsername) // Filter out the logged-in user
          .slice(0, 2)
          .map((user, index) => (
            <div className="suggestions__username" key={index}>
              <span className="avatar">
                <Avatar style={{ marginRight: "10px" }}>
                  <img
                    className="avatar"
                    src={user.img}
                    alt={'Photo of ' + user.img}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                    }}
                  />
                </Avatar>
              </span>
              <div className="username__info">
                <span className="username">{user.username}</span>
              </div>
              <button className="follow__button">Follow</button>
            </div>
          ))
      ) : (
        <p>Loading suggested users...</p>
      )}
    </div>
  </div>
);
}

export default Suggestions;