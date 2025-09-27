export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  streamGroupId: string;
  applicationId: string;
  region: string;
}

export interface GamesConfig {
  games: Game[];
}

export const loadGamesConfig = (): GamesConfig => {
  try {
    // Try to load user's games.json first
    return require('../assets/games/games.json');
  } catch (error) {
    // Fallback to example configuration
    console.log('Using example games configuration');
    return require('../assets/games/games.example.json');
  }
};

export const getGameById = (id: string): Game | undefined => {
  const config = loadGamesConfig();
  return config.games.find(game => game.id === id);
};
