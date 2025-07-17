import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_KEY = "67661954";

function MovieDetail({ darkMode }) {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie detail:", error);
      }
    };

    fetchMovieDetail();
  }, [imdbID]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-detail">
      <Link to="/" className="back-button">← Back to Search</Link>
      <div className="movie-card" style={{ maxWidth: "600px", margin: "20px auto" }}>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x400"}
          alt={movie.Title}
          style={{ width: "100%" }}
        />
        <h2>{movie.Title}</h2>
        <p><strong>Year:</strong> {movie.Year}</p>
        <p><strong>Rated:</strong> {movie.Rated}</p>
        <p><strong>Released:</strong> {movie.Released}</p>
        <p><strong>Runtime:</strong> {movie.Runtime}</p>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Writer:</strong> {movie.Writer}</p>
        <p><strong>Actors:</strong> {movie.Actors}</p>
        <p><strong>Plot:</strong> {movie.Plot}</p>
        <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
      </div>
    </div>
  );
}

export default MovieDetail;
