import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Fetch favorites from local storage
        const fetchFavorites = () => {
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            setFavorites(storedFavorites);
        };

        // Call fetchFavorites on mount
        fetchFavorites();

        // Set up a storage listener to update favorites when local storage changes
        window.addEventListener('storage', fetchFavorites);

        // Clean up listener
        return () => window.removeEventListener('storage', fetchFavorites);
    }, []);

    return (
        <div>
            <h1>Favorites</h1>

            {favorites.length === 0 && <div className="no-games">
                You haven't added any favorites yet!
            </div>}
            {favorites.length > 0 &&
            <div className="games-container">
                {favorites.map(game => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>}
        </div>
    );
}

export default Favorites;
