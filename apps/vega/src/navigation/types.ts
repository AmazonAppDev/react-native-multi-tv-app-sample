export type DrawerParamList = {
  Home: undefined;
  Explore: undefined;
  TV: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Details: { itemId: string };
  Player: { videoId: string };
};
