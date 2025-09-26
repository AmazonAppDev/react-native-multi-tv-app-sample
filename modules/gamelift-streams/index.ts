import { Plugin } from '../../core/types/PluginInterface';

const GameLiftStreamsPlugin: Plugin = {
  id: 'gamelift-streams',
  name: 'GameLift Streams',
  version: '1.0.0',
  description: 'Stream games via Amazon GameLift Streams WebView',
  
  menuItems: [],
  routes: [],

  async initialize(): Promise<void> {
    console.log('GameLift Streams WebView plugin initialized');
  },

  async cleanup(): Promise<void> {
    console.log('GameLift Streams WebView plugin cleaned up');
  }
};

export default GameLiftStreamsPlugin;
