import { useState, useEffect } from 'react';
import { PluginManager } from '../PluginManager';
import { MenuItemConfig, RouteConfig } from '../types/PluginInterface';

export const usePlugins = () => {
  const [menuItems, setMenuItems] = useState<MenuItemConfig[]>([]);
  const [routes, setRoutes] = useState<RouteConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePlugins = async () => {
      try {
        await PluginManager.initialize();
        setMenuItems(PluginManager.getMenuItems());
        setRoutes(PluginManager.getRoutes());
      } catch (error) {
        console.error('Failed to initialize plugins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePlugins();
  }, []);

  return {
    menuItems,
    routes,
    isLoading
  };
};
