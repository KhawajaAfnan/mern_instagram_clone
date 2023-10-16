import React, { useState } from 'react';

import Logo from './logo.png'; // Import the image
import './Sidenav.css'; // Make sure the path to your Sidenav.css file is correct
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MenuIcon from '@mui/icons-material/Menu';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { setLoggedInUsername, getLoggedInUsername } from '../user';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { setuserimg, getuserimg } from '../user';
import { Avatar } from "@mui/material";
import Homepage from '../homepage';




function Sidenav({reloadTimeline}) {
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [user, setUser] = useState('');
  const [userImg, setUserImg] = useState('');
  const [postImg, setPostImg] = useState('');
  
  const [posts, setPosts] = useState([]);

  const handleCreatePopup = () => {
    setCreatePopupOpen(true);
  };

  const closeCreatePopup = () => {
    setCreatePopupOpen(false);
    setUser('');
    setUserImg('');
    setPostImg('');
  };


  const handleCreatePost = async () => {
    const postData = {
      user: getLoggedInUsername(),
      userimg: getuserimg(),
      postImage: postImg,
      likes: 0,
      timestamp: new Date().toISOString(),
    };
  
    try {
      const response = await fetch('http://localhost:3001/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (response.ok) {
        // Successful post
        console.log('Post created successfully');
        // Update the state with the new post data
        setPosts(prevPosts => [postData, ...prevPosts]); // Assuming setPosts is the state updater for your posts
        closeCreatePopup();
        if(reloadTimeline)
        reloadTimeline();
            } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  
    const handlelogout = async () => {
      setuserimg('');
      setLoggedInUsername('');
      // You might want to clear any other data here
  
      // Reload the page to simulate logging out
      window.location.reload();
    };

  return (
    <div className='sidenav__logo'>
      <img src={Logo} alt="Logo" /> {/* Use the imported image */}
      <div className='sidenav__button'>

        <button className='sidenav__buttons'>
        <Avatar style={{ marginRight: "10px" }}>
                <img
                  className="avatar"
                  src={getuserimg()}
                    alt={'Photo of ' + getuserimg()}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                  }}
                />
              </Avatar>{" "}
          <span>Welcome {getLoggedInUsername()}</span>
          </button>

          <button className='sidenav__buttons'>
          <ExploreIcon/>
          <span>Explore</span>
        </button>

        <button className='sidenav__buttons'>
          <SearchIcon/>
          <span>Search</span>
        </button>

        <button className='sidenav__buttons'>
          <ChatBubbleIcon/>
          <span>Chat</span>
        </button>
        
        <button className='sidenav__buttons'>
          <SlideshowIcon/>
          <span>Reels </span>
        </button>

        <button className='sidenav__buttons'onClick={handlelogout}>
        <LogoutIcon/>       
           <span>Logout</span>
        </button>
        
        <button className='sidenav__buttons' onClick={handleCreatePopup}>
        <AddCircleOutlineIcon />
        <span>Create</span>
      </button>
        
      </div>
      <button className='sidenav__more'>
          <MenuIcon/>
          <span>More
          </span>
        </button>
        
        
   
    
    {isCreatePopupOpen && (
        <div className='create-popup'>
          <div className='popup-content'>
            <h2>Create Post</h2>
            <input
              type='text'
              placeholder='Post Image'
              value={postImg}
              onChange={(e) => setPostImg(e.target.value)}
            />
            <button onClick={handleCreatePost}>Create</button>
            <button onClick={closeCreatePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Sidenav;
