import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function GameDetails() {
    const { appId } = useParams();
    const [game, setGame] = useState({});

    useEffect(() => {
        // Fetch game details from API
        axios.get(`http://localhost:1337/games/${appId}`)
            .then(response => {
                setGame(response.data);
            })
            .catch(error => console.error('Error fetching game details:', error));
    }, [appId]);

    return (
        <div>
            <img src={game.header_image} alt={game.name} />
            <h1>{game.name}</h1>
            <p>{game.short_description}</p>
        </div>
    );
}

export default GameDetails;