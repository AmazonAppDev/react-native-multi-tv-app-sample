// Catalog API types

/** A sidecar caption file (WebVTT) for a title. */
export type CaptionTrack = {
  url: string;
  /** Two-letter ISO 639-1 language code, e.g. "en" or "es". */
  language: string;
  /** Name shown in track menus; defaults to the language. */
  label?: string;
};

export type CatalogItem = {
  id: string;
  type: string;
  title: string;
  category: string;
  genres: string[];
  trending: boolean;
  rating_count: number;
  rating_stars: number;
  content_rating: string;
  release_year: number;
  duration_sec: number;
  images: {
    poster_16x9: string;
  };
  sources: Array<{
    type: string;
    url: string;
    /** This version has Audio Description (a narrated description of the picture) in its soundtrack. */
    audio_description?: boolean;
  }>;
  description: string;
  /** Optional sidecar captions. Shown when the viewer turns on Closed Captions in the TV's settings. */
  captions?: CaptionTrack[];
};

export type CatalogResponse = {
  catalog_version: string;
  updated_at: string;
  items: CatalogItem[];
};

// Simplified card data for UI components
export type CardData = {
  id: string | number;
  title: string;
  description: string;
  headerImage: string;
  movie: string;
  duration?: number;
  category?: string;
  genres?: string[];
  releaseYear?: number;
  rating?: number;
  ratingCount?: number;
  contentRating?: string;
  trending?: boolean;
  captions?: CaptionTrack[];
  /** The Audio Description version of the movie, played when the viewer turns Audio Description on. */
  describedMovie?: string;
};

const CATALOG_URL = 'https://giolaq.github.io/scrap-tv-feed/catalog.json';

// Transform catalog item to CardData format
export const transformCatalogItem = (item: CatalogItem): CardData => {
  // The Audio Description version is an alternative, never the default.
  const standardSources = item.sources.filter(s => !s.audio_description);
  const videoSource = standardSources.find(s => s.type === 'video/mp4') || standardSources[0];
  const describedSource = item.sources.find(s => s.audio_description);

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    headerImage: item.images.poster_16x9,
    movie: videoSource?.url || '',
    duration: item.duration_sec,
    category: item.category,
    genres: item.genres,
    releaseYear: item.release_year,
    rating: item.rating_stars,
    ratingCount: item.rating_count,
    contentRating: item.content_rating,
    trending: item.trending,
    captions: item.captions,
    describedMovie: describedSource?.url,
  };
};

// Fetch movies from catalog
export const fetchMoviesData = async (): Promise<CardData[]> => {
  try {
    const response = await fetch(CATALOG_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CatalogResponse = await response.json();
    return data.items.map(transformCatalogItem);
  } catch (error) {
    console.error('Failed to fetch movies catalog:', error);
    throw error;
  }
};

// Empty array as placeholder - movies will be fetched dynamically
export const moviesData: CardData[] = [];
