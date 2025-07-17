import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_KEY = "67661954";

function MovieSearch({ darkMode }) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [type, setType] = useState("all");
  const [year, setYear] = useState("");

  const navigate = useNavigate();

  const searchMovies = async (searchQuery = query) => {
    if (!searchQuery) return;

    const url = `https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}${
      type !== "all" ? `&type=${type}` : ""
    }${year ? `&y=${year}` : ""}`;

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
        setSuggestions([]);
      } else {
        setMovies([]);
        alert(data.Error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
        setSuggestions(data.Search.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div className="movie-search">
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
          className={darkMode ? "dark-input" : ""}
        />
        <button onClick={searchMovies}>Search</button>

        {suggestions.length > 0 && (
          <ul className={`suggestions ${darkMode ? "dark-suggestions" : ""}`}>
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

        <div className="filters">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>

          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>

      <div className="movie-list">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie.imdbID}
            onClick={() => navigate(`/movie/${movie.imdbID}`)}
            style={{ cursor: "pointer" }}
          >
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

export default MovieSearch;
