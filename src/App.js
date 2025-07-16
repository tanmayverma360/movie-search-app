import React, { useState } from "react";
import "./App.css";

const API_KEY = "67661954"; 

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

const searchMovies = async () => {
  if (!query) return;

  const url = `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      // Fetch full details for each movie
      const detailedMovies = await Promise.all(
        data.Search.map(async (movie) => {
          const detailUrl = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`;
          const res = await fetch(detailUrl);
          const fullData = await res.json();
          return fullData;
        })
      );

      setMovies(detailedMovies);
    } else {
      setMovies([]);
      alert(data.Error);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


  return (
    <div className="App">
      <h1>🎬 Movie Search App</h1>
      <div className="search-box">
       <input
  type="text"
  placeholder="Search for a movie..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => {
    console.log("Key pressed:", e.key); // for debugging
    if (e.key === "Enter") {
      searchMovies();
    }
  }}
/>



        <button onClick={searchMovies}>Search</button>
      </div>

      <div className="movie-list">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.imdbID}>
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/200x300?text=No+Image"
              }
              alt={movie.Title}
            />
            <h3>{movie.Title}</h3>
<p>📅 {movie.Year}</p>
<p>⭐ IMDb Rating: {movie.imdbRating !== "N/A" ? movie.imdbRating : "Not Rated"}</p>

          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
