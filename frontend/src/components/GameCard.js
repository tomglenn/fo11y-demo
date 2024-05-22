import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import getUserUUID from '../utils/getUserUUID';

function GameCard({ game }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const userUUID = getUserUUID();

    useEffect(() => {
        // Grab favorites from local storage and set game status if there is an existing entry
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorited(favorites.filter(x => x && x.id === game.id).length > 0);
    }, [game.id]);

    // Toggle the status of this game as a favorite
    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.filter(x => x && x.id === game.id).length > 0) {
            const filteredFavorites = favorites.filter(x => x && x.id !== game.id);
            localStorage.setItem('favorites', JSON.stringify(filteredFavorites));
            setIsFavorited(false);
        } else {
            favorites.push(game);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorited(true);
        }

        // Force a storage event so the favorites list updates
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <div className="game-card">
            <div className="game-image-container">
                <img src={game.header_image} alt={game.name} className="game-image" />
                <button onClick={toggleFavorite} className="favorite-button">
                    <FontAwesomeIcon icon={isFavorited ? fasStar : farStar} className="favorite-icon" />
                    {isFavorited ? "Favorited" : "Add to Favorites"}
                </button>
                
                {game.discounted && (
                    <div className="discount-tag">-{game.discount_percent}%</div>
                )}
            </div>
            <div className="game-card-details">
                <h3 className="game-name">
                    <a href={`https://store.steampowered.com/app/${game.id}`} target="_blank" rel="noreferrer">{game.name}</a>
                </h3>
                <p className="game-price">
                    {game.discounted && <span className="original-price">£{(game.original_price / 100).toFixed(2)}</span>}
                    <span className={game.discounted ? "discounted-price" : ""}>£{(game.final_price / 100).toFixed(2)}</span>
                </p>
            </div>
        </div>
    );
}

export default GameCard;
