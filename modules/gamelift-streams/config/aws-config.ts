interface GameLiftConfig {
  cognito: {
    userPoolId: string;
    userPoolClientId: string;
    region: string;
  };
  api: {
    endpoint: string;
    region: string;
  };
  gamelift: {
    defaultRegions: string[];
    connectionTimeout: number;
  };
}

// Import the plugin config as fallback
const pluginConfig = require('./plugin-config.json');

export const loadGameLiftConfig = (): GameLiftConfig => {
  // Log environment variables for debugging
  console.log('Environment variables:', {
    GAMELIFT_USER_POOL_ID: process.env.GAMELIFT_USER_POOL_ID,
    GAMELIFT_USER_POOL_CLIENT_ID: process.env.GAMELIFT_USER_POOL_CLIENT_ID,
    GAMELIFT_COGNITO_REGION: process.env.GAMELIFT_COGNITO_REGION,
    GAMELIFT_API_ENDPOINT: process.env.GAMELIFT_API_ENDPOINT
  });

  const config = {
    cognito: {
      userPoolId: process.env.GAMELIFT_USER_POOL_ID || pluginConfig.aws.cognito.userPoolId,
      userPoolClientId: process.env.GAMELIFT_USER_POOL_CLIENT_ID || pluginConfig.aws.cognito.userPoolClientId,
      region: process.env.GAMELIFT_COGNITO_REGION || pluginConfig.aws.cognito.region
    },
    api: {
      endpoint: process.env.GAMELIFT_API_ENDPOINT || pluginConfig.aws.api.endpoint,
      region: process.env.GAMELIFT_API_REGION || pluginConfig.aws.api.region
    },
    gamelift: {
      defaultRegions: process.env.GAMELIFT_DEFAULT_REGIONS 
        ? process.env.GAMELIFT_DEFAULT_REGIONS.split(',')
        : pluginConfig.aws.gamelift.defaultRegions,
      connectionTimeout: parseInt(process.env.GAMELIFT_CONNECTION_TIMEOUT || '120')
    }
  };

  // Check if we're still using placeholder values
  if (config.cognito.userPoolId.includes('PLACEHOLDER')) {
    console.error('❌ Using placeholder AWS configuration. Please check your .env file.');
    console.error('Expected .env file location:', process.cwd() + '/.env');
  }

  return config;
};

export type { GameLiftConfig };
