// App.js

import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  
  useEffect(() => {
    // Function to parse URL parameters
    const getHashParams = () => {
      const hashParams = {};
      const hash = window.location.hash.substring(1);
      const params = hash.split('&');
      params.forEach(param => {
        const [key, value] = param.split('=');
        hashParams[key] = decodeURIComponent(value);
      });
      return hashParams;
    };
  
    // Function to handle Spotify authentication
    const handleLogin = () => {
      const params = getHashParams();
      const token = params.access_token;
      if (token) {
        spotifyApi.setAccessToken(token);
        setAccessToken(token);
        setLoggedIn(true);
      }
  
      // Clear the hash after retrieving the access token
      window.history.replaceState(null, null, window.location.pathname);
    };
  
    handleLogin();
  }, [loggedIn]);

  // Function to handle login button click
  const handleLoginClick = () => {
    const client_id = '7b7377519e3148aaaddf3b40c9985319';
    const redirect_uri = 'http://localhost:5000/callback'; // Set your redirect URI
    const scope = 'user-read-private user-read-email playlist-read-private'; // Add necessary scopes
    
    window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=${encodeURIComponent(
      scope
    )}`;
  };

  const handleLogoutClick = () => {
    spotifyApi.setAccessToken('');
    setLoggedIn(false);
    setAccessToken('');
  };

  // Function to fetch user's playlists
  const getUserPlaylists = async () => {
    try {
      const response = await spotifyApi.getUserPlaylists();
      console.log(response.items); // Handle the playlists data here
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!loggedIn ? (
          <button onClick={handleLoginClick}>Login to Spotify</button>
        ) : ( 
          <div> 
            <button onClick={getUserPlaylists}>Get Playlists</button>
            <button onClick={handleLogoutClick}>Logout </button>
          </div>
        )}
        
      </header>
    </div>
  );
}

export default App;
