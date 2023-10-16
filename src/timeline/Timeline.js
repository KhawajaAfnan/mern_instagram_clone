import React, { useState, useEffect } from "react";
import Post from "./posts/post";
import Suggestions from "./suggestions";
import "./Timeline.css";
import Sidenav from "../navigation/Sidenav";

function Timeline({refreshTimeline}) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    // Fetch posts from your backend API
    fetch('http://localhost:3001/', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setPosts(data.data); // Assuming your API returns an object with a 'data' property
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    // Fetch posts again if refreshTimeline changes
    if (refreshTimeline) {
      fetchPosts()
        .then((data) => {
          setPosts(data);
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
        });
    }
  }, [refreshTimeline]);

  const handlelike = async (postId) => {
  try {
    const response = await fetch(`http://localhost:3001/items/${postId}`, {
      method: 'PATCH',
    });

    if (response.ok) {
      // Successful like
      console.log('Post liked successfully');

      // Now, you need to update the likes count for the specific post in your state
      // Find the post by its ID and update its likes
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      });

      setPosts(updatedPosts);
    } else {
      console.error('Failed to like post');
    }
  } catch (error) {
    console.error('Error liking post:', error);
  }
};


  return (
    <div className="timeline">
      <div className="timeline__left">
        {/* Pass the 'posts' prop to the Post component */}
        <Post posts={posts} handlelike={handlelike} fetchPosts={fetchPosts}/>
      </div>
      <div className="timeline__right">
        <Suggestions />
        
      </div>
    </div>
  );
}

export default Timeline;
