export interface MenuItemConfig {
  id: string;
  label: string;
  route: string;
  requiresAuth?: boolean;
}

export interface RouteConfig {
  name: string;
  component: string;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  menuItems: MenuItemConfig[];
  routes: RouteConfig[];
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
}
