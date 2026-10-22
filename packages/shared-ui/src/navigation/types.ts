import type { CaptionTrack } from '../data/moviesData';

export type RootStackParamList = {
  DrawerNavigator: undefined;
  Details: {
    title: string;
    description: string;
    headerImage: string;
    movie: string;
    category?: string;
    genres?: string[];
    releaseYear?: number;
    rating?: number;
    ratingCount?: number;
    contentRating?: string;
    duration?: number;
    captions?: CaptionTrack[];
    describedMovie?: string;
  };
  Player: {
    movie: string;
    headerImage: string;
    captions?: CaptionTrack[];
    describedMovie?: string;
  };
};

export type DrawerParamList = {
  Home: undefined;
  Explore: undefined;
  TV: undefined;
  Settings: undefined;
};
