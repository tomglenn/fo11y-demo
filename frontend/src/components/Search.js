import React, { useState, useEffect } from 'react';
import axios from 'axios';
import lodashDebounce from 'lodash.debounce';
import GameCard from './GameCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import getUserUUID from '../utils/getUserUUID';

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch games from API
        const fetchGames = async () => {
            if (!searchTerm) return setGames([]);
            try {
                const time = new Date().toISOString();
                const userUUID = getUserUUID();
                console.info(`time=${time} user_id="${userUUID}" action=search query="${searchTerm}"`);

                setIsLoading(true);
                const response = await axios.get(`http://localhost:1337/games?q=${encodeURIComponent(searchTerm)}`);
                setIsLoading(false);
                setGames(response.data);
            } catch (error) {
                console.error('Failed to fetch games:', error);
                setIsLoading(false); 
            }
        };

        // Debounce is used to make sure we don't search after every character change
        const debouncedFetch = lodashDebounce(fetchGames, 300);
        debouncedFetch();

        // Cancel any outstanding fetches when the component unmounts
        return () => debouncedFetch.cancel();
    }, [searchTerm]);

    return (
        <div>
            <h1>Search Games</h1>
            <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
            />

            {isLoading && <div className="loading-spinner">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>}

            {!isLoading && games.length > 0 &&
            <div className="games-container">
                {games.map(game => <GameCard key={game.id} game={game} />)}
            </div>}

            {!isLoading && games.length === 0 && <div className="no-games">
                {searchTerm === "" ? "Let's find some games!" : "No games found."}
            </div>}
        </div>
    );
}

export default Search;