import { StyleSheet, View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { useMenuContext } from '../components/MenuContext';
import {
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationScrollView,
  SpatialNavigationNode,
  SpatialNavigationVirtualizedList,
  SpatialNavigationVirtualizedListRef,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../hooks/useScale';
import { RootStackParamList } from '../navigation/types';
import { fetchMoviesData, CardData } from '../data/moviesData';
import { colors, safeZones } from '../theme';
import PlatformLinearGradient from '../components/PlatformLinearGradient';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

// Memoized MovieItem component to prevent unnecessary re-renders and optimize image source
const MovieItem = React.memo(
  ({
    item,
    isFocused,
    styles,
  }: {
    item: CardData;
    isFocused: boolean;
    styles: any;
  }) => {
    const imageSource = useMemo(() => ({ uri: item.headerImage }), [item.headerImage]);

    return (
      <View style={[styles.highlightThumbnail, isFocused && styles.highlightThumbnailFocused]}>
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', item.title, error.nativeEvent.error)}
          onLoad={() => console.log('Image loaded:', item.title)}
        />
      </View>
    );
  },
);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const trendingRef = useRef<SpatialNavigationVirtualizedListRef>(null);
  const classicsRef = useRef<SpatialNavigationVirtualizedListRef>(null);
  const hipAndModernRef = useRef<SpatialNavigationVirtualizedListRef>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [moviesData, setMoviesData] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  // Fetch movies from catalog on mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const movies = await fetchMoviesData();
        console.log('Fetched movies:', movies.length);
        console.log('First movie:', movies[0]);
        setMoviesData(movies);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  const focusedItem = useMemo(() => moviesData[focusedIndex] || null, [focusedIndex, moviesData]);

  // Memoize header image source to prevent unnecessary re-renders
  const headerImageSource = useMemo(
    () => (focusedItem ? { uri: focusedItem.headerImage } : undefined),
    [focusedItem?.headerImage],
  );

  const renderHeader = useCallback(
    () => {
      if (!focusedItem) return null;

      return (
        <View style={gridStyles.header}>
          <Image
            style={gridStyles.headerImage}
            source={headerImageSource}
            resizeMode="cover"
          />
        </View>
      );
    },
    [headerImageSource, focusedItem],
  );

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === 'left' && focusedIndex === 0) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, focusedIndex, navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CardData; index: number }) => (
      <SpatialNavigationFocusableView
        onSelect={() => {
          navigation.navigate('Details', {
            title: item.title,
            description: item.description,
            headerImage: item.headerImage,
            movie: item.movie,
            category: item.category,
            genres: item.genres,
            releaseYear: item.releaseYear,
            rating: item.rating,
            ratingCount: item.ratingCount,
            contentRating: item.contentRating,
            duration: item.duration,
          });
        }}
        onFocus={() => setFocusedIndex(index)}
      >
        {({ isFocused }) => <MovieItem item={item} isFocused={isFocused} styles={gridStyles} />}
      </SpatialNavigationFocusableView>
    ),
    [navigation],
  );

  const renderScrollableRow = useCallback(
    (title: string, _ref: React.RefObject<SpatialNavigationVirtualizedListRef>) => {
      return (
        <View style={gridStyles.highlightsContainer}>
          <Text style={gridStyles.highlightsTitle}>{title}</Text>
          <SpatialNavigationNode>
            <DefaultFocus>
              <SpatialNavigationVirtualizedList
                data={moviesData}
                orientation="horizontal"
                renderItem={renderItem}
                itemSize={scaledPixels(440)}
                numberOfRenderedItems={6}
                numberOfItemsVisibleOnScreen={4}
                onEndReachedThresholdItemsNumber={3}
              />
            </DefaultFocus>
          </SpatialNavigationNode>
        </View>
      );
    },
    [moviesData, renderItem],
  );

  // Show loading state while fetching data
  if (isLoading || moviesData.length === 0) {
    return (
      <View style={gridStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: scaledPixels(24) }}>Loading movies...</Text>
        </View>
      </View>
    );
  }

  return (
    <SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <View style={gridStyles.container}>
        {renderHeader()}
        <SpatialNavigationScrollView offsetFromStart={scaledPixels(60)} style={gridStyles.scrollContent}>
          {renderScrollableRow('Trending Movies', trendingRef)}
          {renderScrollableRow('Classics', classicsRef)}
          {renderScrollableRow('Hip and Modern', hipAndModernRef)}
        </SpatialNavigationScrollView>
      </View>
    </SpatialNavigationRoot>
  );
}

const gridStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flex: 1,
      marginBottom: scaledPixels(safeZones.actionSafe.vertical),
    },
    highlightsTitle: {
      color: colors.text,
      fontSize: scaledPixels(40),
      fontWeight: 'bold',
      marginBottom: scaledPixels(16),
      marginTop: scaledPixels(20),
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    headerTitle: {
      color: colors.text,
      fontSize: scaledPixels(56),
      fontWeight: 'bold',
      marginBottom: scaledPixels(16),
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 12,
    },
    headerDescription: {
      color: colors.text,
      fontSize: scaledPixels(28),
      fontWeight: '500',
      lineHeight: scaledPixels(40),
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    thumbnailTextContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.scrimDark,
      paddingHorizontal: scaledPixels(16),
      paddingVertical: scaledPixels(12),
      borderBottomLeftRadius: scaledPixels(8),
      borderBottomRightRadius: scaledPixels(8),
    },
    thumbnailText: {
      color: colors.text,
      fontSize: scaledPixels(24),
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: scaledPixels(32),
    },
    highlightThumbnail: {
      width: scaledPixels(420),
      height: scaledPixels(260),
      marginRight: scaledPixels(20),
      backgroundColor: colors.card,
      borderRadius: scaledPixels(12),
      borderWidth: scaledPixels(5),
      borderColor: 'transparent',
      overflow: 'hidden',
    },
    highlightThumbnailFocused: {
      borderColor: colors.focusBorder,
      borderWidth: scaledPixels(6),
      transform: [{ scale: 1.1 }],
      shadowColor: colors.focus,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.9,
      shadowRadius: scaledPixels(20),
      elevation: 15,
    },
    highlightsContainer: {
      paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
      paddingVertical: scaledPixels(16),
      height: scaledPixels(400),
    },
    thumbnailPlaceholder: {
      backgroundColor: colors.cardElevated,
      width: '100%',
      height: '100%',
      borderRadius: scaledPixels(8),
    },
    header: {
      width: '100%',
      height: scaledPixels(700),
      position: 'relative',
    },
    headerImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    gradientLeft: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '65%',
    },
    headerTextContainer: {
      position: 'absolute',
      left: scaledPixels(safeZones.titleSafe.horizontal),
      top: scaledPixels(safeZones.titleSafe.vertical),
      bottom: scaledPixels(safeZones.titleSafe.vertical),
      justifyContent: 'center',
      width: '55%',
    },
    highlightsList: {
      paddingLeft: scaledPixels(20),
    },
    cardImage: {
      width: '100%',
      height: '100%',
      borderRadius: scaledPixels(8),
    },
  });
