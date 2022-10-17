import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const CLIENT_ID = "07c259efd2644f8da47e07d29f30a673"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
const [artists, setArtists] = useState([])

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }

      setToken(token)
  }, [])

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "artist"
        }
    })

    setArtists(data.artists.items)
}
  const logout = () => {
      setToken("")
      window.localStorage.removeItem("token");
      setArtists([])
  }

  const renderArtists = () => {
    return artists.map(artist => (
        <div className="imag" key={artist.id}>
            {artist.images.length ? <img width="250px" height="250px" src={artist.images[0].url} alt={artist.name}/> : <div>No Image</div>}
            <br></br>
            {artist.name}
            <br></br>
            <strong>Followers </strong>
            {artist.followers["total"]}
            <br></br>
            <br></br>
        </div>
    ))
}

  return (
      <div className="App">
          <header className="App-header">
              <h1>Spotify React</h1>
              {!token ?
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                      to Spotify</a>
                  : <button onClick={logout}>Logout</button>}

                  <form onSubmit={searchArtists}>
    <input type="text" onChange={e => setSearchKey(e.target.value)}/>
    <button type={"submit"}>Search</button>
</form>
<div className="imag">{renderArtists()}</div>
          </header>
      </div>
  );
}
export default App;
