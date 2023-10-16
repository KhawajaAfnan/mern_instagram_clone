import React, { useState } from 'react';
import './post.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar, Popover, Typography } from '@mui/material';

function getTimeDifference(postTimestamp) {
  const currentTimestamp = new Date();
  const postTime = new Date(postTimestamp);
  const timeDifference = currentTimestamp - postTime; // Difference in milliseconds

  if (timeDifference < 60 * 1000) {
    return Math.floor(timeDifference / 1000) + 's'; // Seconds
  } else if (timeDifference < 60 * 60 * 1000) {
    return Math.floor(timeDifference / (60 * 1000)) + 'm'; // Minutes
  } else if (timeDifference < 24 * 60 * 60 * 1000) {
    return Math.floor(timeDifference / (60 * 60 * 1000)) + 'h'; // Hours
  } else {
    return Math.floor(timeDifference / (24 * 60 * 60 * 1000)) + 'd'; // Days
  }
}

function Post({ posts, handlelike,fetchPosts }) {
  const [anchorEl, setAnchorEl] = useState(null); // For popover

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Post deleted successfully');
        // After deleting the post, refresh the posts by fetching them again
        fetchPosts();
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  
  return (
    <div className="post">
      {/* Mapping through the passed posts */}
      {posts.map((post, index) => (
        <div key={index}>
          <div className="post__header">
            <div className="post__headerAuthor">
              <Avatar style={{ marginRight: '10px' }}>
                <img
                  className="avatar"
                  src={post.userimg}
                  alt={'Photo of ' + post.user}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: 'cover',
                  }}
                />
              </Avatar>{' '}
              {post.user} • <span>{getTimeDifference(post.timestamp)}</span>
            </div>
            <MoreHorizIcon onClick={handlePopoverOpen} />
          </div>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Typography>
              <button>Edit</button>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
                          </Typography>
          </Popover>
          <div className="post__image">
            <img src={post.postImage} alt="Post Image" />
          </div>
          <div className="post__footer">
            <div className="post__footerIcons">
              <div className="post__iconsMain">
                <FavoriteBorderIcon
                  className="postIcon"
                  onClick={() => handlelike(post._id)}
                />
                <ChatBubbleOutlineIcon className="postIcon" />
                <TelegramIcon className="postIcon" />
              </div>
              <div className="post__iconSave">
                <BookmarkBorderIcon className="postIcon" />
              </div>
            </div>
            Liked by {post.likes} people.
          </div>
        </div>
      ))}
    </div>
  );
}

export default Post;
