import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieSearch from "./components/MovieSearch";
import MovieDetail from "./components/MovieDetail";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      {/* Only ONE .App div */}
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

        <Routes>
          <Route path="/" element={<MovieSearch darkMode={darkMode} />} />
          <Route path="/movie/:imdbID" element={<MovieDetail darkMode={darkMode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
