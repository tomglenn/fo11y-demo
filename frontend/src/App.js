import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Favorites from './components/Favorites';
import Search from './components/Search';
import About from './components/About';
import getUserUUID from './utils/getUserUUID'

function App() {
  const userUUID = getUserUUID();
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/favorites">Favorites</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <p className="userId">Your unique user ID is {userUUID}.</p>
    </Router>
  );
}

export default App;
