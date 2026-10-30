import { transformCatalogItem, type CatalogItem } from '../../../packages/shared-ui/src/data/moviesData';

const item = (sources: CatalogItem['sources']): CatalogItem => ({
  id: 'title',
  type: 'movie',
  title: 'Title',
  category: 'Drama',
  genres: [],
  trending: false,
  rating_count: 0,
  rating_stars: 0,
  content_rating: 'TV-G',
  release_year: 2026,
  duration_sec: 60,
  images: { poster_16x9: 'https://example.com/poster.jpg' },
  sources,
  description: '',
});

describe('transformCatalogItem', () => {
  it('plays the standard version and keeps the Audio Description version as the alternative', () => {
    const card = transformCatalogItem(
      item([
        { type: 'mp4', url: 'https://example.com/described.mp4', audio_description: true },
        { type: 'mp4', url: 'https://example.com/standard.mp4' },
      ]),
    );
    expect(card.movie).toBe('https://example.com/standard.mp4');
    expect(card.describedMovie).toBe('https://example.com/described.mp4');
  });

  it('has no Audio Description version when the catalog lists none', () => {
    const card = transformCatalogItem(item([{ type: 'mp4', url: 'https://example.com/standard.mp4' }]));
    expect(card.movie).toBe('https://example.com/standard.mp4');
    expect(card.describedMovie).toBeUndefined();
  });
});
