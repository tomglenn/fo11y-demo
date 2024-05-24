import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameCard from './GameCard';

function Home() {
    const [games, setGames] = useState([]);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        axios.get(`${backendUrl}/featured`)
            .then(response => {
                setGames(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [backendUrl]);

    return (
        <div>
            <h1>Featured Games</h1>
            <div className="games-container">
                {games.map(game => (
                    <GameCard key={`${game.id}-${game.name}`} game={game} />
                ))}
            </div>
        </div>
    );
}

export default Home;