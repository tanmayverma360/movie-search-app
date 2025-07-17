import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "67661954";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const searchMovies = async (searchQuery = query) => {
    if (!searchQuery) return;

    const url = `https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailUrl = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`;
            const res = await fetch(detailUrl);
            const fullData = await res.json();
            return fullData;
          })
        );

        setMovies(detailedMovies);
        setSuggestions([]); // Clear suggestions after search
      } else {
        setMovies([]);
        alert(data.Error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (text) => {
    if (!text) {
      setSuggestions([]);
      return;
    }

    const url = `https://www.omdbapi.com/?s=${text}&apikey=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        setSuggestions(data.Search.slice(0, 5)); // limit suggestions
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <div className="header">
        <h1>🎬 Movie Search App</h1>
        <button
          className="toggle-button"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchMovies();
          }}
        />
        <button onClick={() => searchMovies()}>Search</button>

        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((sug) => (
              <li
                key={sug.imdbID}
                onClick={() => {
                  setQuery(sug.Title);
                  searchMovies(sug.Title);
                  setSuggestions([]);
                }}
              >
                {sug.Title} ({sug.Year})
              </li>
            ))}
          </ul>
        )}
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
            <p>
              ⭐ IMDb Rating:{" "}
              {movie.imdbRating !== "N/A" ? movie.imdbRating : "Not Rated"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
