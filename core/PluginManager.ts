import { Plugin, MenuItemConfig, RouteConfig } from './types/PluginInterface';

class PluginManagerClass {
  private plugins: Map<string, Plugin> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Auto-discover and load plugins
    await this.loadPlugins();
    this.initialized = true;
  }

  private async loadPlugins(): Promise<void> {
    try {
      // Try to load GameLift Streams plugin
      const gameLiftPlugin = await import('../modules/gamelift-streams');
      if (gameLiftPlugin.default) {
        await this.registerPlugin(gameLiftPlugin.default);
      }
    } catch (error) {
      // Plugin not available, continue without it
      console.log('GameLift Streams plugin not available');
    }
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    await plugin.initialize();
    this.plugins.set(plugin.id, plugin);
  }

  getMenuItems(): MenuItemConfig[] {
    const items: MenuItemConfig[] = [];
    this.plugins.forEach(plugin => {
      items.push(...plugin.menuItems);
    });
    return items;
  }

  getRoutes(): RouteConfig[] {
    const routes: RouteConfig[] = [];
    this.plugins.forEach(plugin => {
      routes.push(...plugin.routes);
    });
    return routes;
  }

  async cleanup(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      await plugin.cleanup();
    }
    this.plugins.clear();
    this.initialized = false;
  }
}

export const PluginManager = new PluginManagerClass();
