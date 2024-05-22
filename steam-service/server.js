const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 1337;

app.use(express.json());

// Enable CORS for all routes if needed (optional, but usually necessary for API services)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Cache games from steam
let games; // Cache for steam game app ids (populated at start up)
let gameDetails = {}; // Cache for game details (populated on demand)
let featuredGames; // Cache for featured games (populated the first time the /featured endpoint is called)

async function getAndCacheGames() {
    try {
        const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
        games = response.data.applist.apps;
        console.log(`Fetched ${games.length} games`);
    }
    catch (error) {
        console.error('Error fetching games:', error);
    }
}

getAndCacheGames();

// Route to get a list of games
app.get('/games', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const query = req.query.q || "";

    var filteredGames = games.filter(x => x.name.toLowerCase().includes(query.toLowerCase())).slice(0, limit);

    console.log(`Found ${filteredGames.length} of ${games.length} games for query '${query}' and limit ${limit}`);
    
    let details = [];
    for (var game of filteredGames) {
      var appId = game.appid;

      // Only fetch game details if they aren't already cached
      if (!gameDetails[appId]) {
          const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
          var data = response.data[appId].data;
          
          // Filter any unsuccessful responses, or where we don't have price data as that means it's not for sale.
          if (!response.data[appId].success || !data || !data.price_overview) {
            continue;
          }

          // Build a model that matches what we get back from the featured endpoint for consistency
          gameDetails[appId] = {
            id: appId,
            name: data.name,
            discounted: data.price_overview.discount_percent > 0,
            discount_percent: data.price_overview.discount_percent,
            original_price: data.price_overview.initial,
            final_price: data.price_overview.final,
            header_image: data.header_image,
            windows_available: data.platforms.windows,
            mac_available: data.platforms.mac,
            linux_available: data.platforms.linux,
            short_description: data.short_description,
            publishers: data.publishers,
            developers: data.developers,
            categories: data.categories,
            screenshots: data.screenshots,
            genres: data.genres,
            background: data.background
          };
      }

      if (gameDetails[appId] == null) {
        continue;
      }

      details.push(gameDetails[appId]);
    }
    
    return res.json(details);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Most popular games
app.get('/featured', async (req, res) => {
    try {
      // Only fetch featured games if they're not already cached
      if (!featuredGames) {
          const result = await axios.get(`http://store.steampowered.com/api/featured/`);
          featuredGames = result.data.featured_mac;
      }

      res.json(featuredGames);
    } catch (error) {
      console.error('Error fetching featured games:', error);
      res.status(500).json({ error: 'Failed to fetch featured games' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
