import { StyleSheet, View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { moviesData, CardData } from '../data/moviesData';

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
        <Image source={imageSource} style={styles.headerImage} />
        <View style={styles.thumbnailTextContainer}>
          <Text style={styles.thumbnailText}>{item.title}</Text>
        </View>
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
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  const focusedItem = useMemo(() => moviesData[focusedIndex], [focusedIndex]);

  // Memoize header image source to prevent unnecessary re-renders
  const headerImageSource = useMemo(
    () => ({ uri: focusedItem.headerImage }),
    [focusedItem.headerImage],
  );

  const renderHeader = useCallback(
    () => (
      <View style={gridStyles.header}>
        <Image
          style={gridStyles.headerImage}
          source={headerImageSource}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={gridStyles.gradientLeft}
        />
        <LinearGradient
          colors={['rgb(0,0,0)', 'rgba(0,0,0, 0.3)', 'transparent']}
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={gridStyles.gradientBottom}
        />
        <View style={gridStyles.headerTextContainer}>
          <Text style={gridStyles.headerTitle}>{focusedItem.title}</Text>
          <Text style={gridStyles.headerDescription}>{focusedItem.description}</Text>
        </View>
      </View>
    ),
    [headerImageSource, focusedItem.title, focusedItem.description],
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

  const renderScrollableRow = useCallback(
    (title: string, _ref: React.RefObject<SpatialNavigationVirtualizedListRef>) => {
      const renderItem = useCallback(
        ({ item, index }: { item: CardData; index: number }) => (
          <SpatialNavigationFocusableView
            onSelect={() => {
              navigation.navigate('Details', {
                title: item.title,
                description: item.description,
                headerImage: item.headerImage,
                movie: item.movie,
              });
            }}
            onFocus={() => setFocusedIndex(index)}
          >
            {({ isFocused }) => <MovieItem item={item} isFocused={isFocused} styles={gridStyles} />}
          </SpatialNavigationFocusableView>
        ),
        [navigation],
      );

      return (
        <View style={gridStyles.highlightsContainer}>
          <Text style={gridStyles.highlightsTitle}>{title}</Text>
          <SpatialNavigationNode>
            <DefaultFocus>
              <SpatialNavigationVirtualizedList
                data={moviesData}
                orientation="horizontal"
                renderItem={renderItem}
                itemSize={scaledPixels(425)}
                numberOfRenderedItems={6}
                numberOfItemsVisibleOnScreen={4}
                onEndReachedThresholdItemsNumber={3}
              />
            </DefaultFocus>
          </SpatialNavigationNode>
        </View>
      );
    },
    [navigation],
  );

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
      backgroundColor: 'black',
    },
    scrollContent: {
      flex: 1,
      marginBottom: scaledPixels(48),
    },
    highlightsTitle: {
      color: '#fff',
      fontSize: scaledPixels(34),
      fontWeight: 'bold',
      marginBottom: scaledPixels(10),
      marginTop: scaledPixels(15),
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    headerTitle: {
      color: '#fff',
      fontSize: scaledPixels(48),
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    headerDescription: {
      color: '#fff',
      fontSize: scaledPixels(24),
      fontWeight: '500',
      paddingTop: scaledPixels(16),
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    thumbnailTextContainer: {
      position: 'absolute',
      bottom: scaledPixels(10),
      left: scaledPixels(10),
      right: scaledPixels(10),
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: scaledPixels(5),
      borderRadius: scaledPixels(3),
    },
    thumbnailText: {
      color: '#fff',
      fontSize: scaledPixels(18),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    highlightThumbnail: {
      width: scaledPixels(400),
      height: scaledPixels(240),
      marginRight: scaledPixels(10),
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: scaledPixels(5),
    },
    highlightThumbnailFocused: {
      borderColor: '#fff',
      borderWidth: scaledPixels(4),
    },
    highlightsContainer: {
      padding: scaledPixels(10),
      height: scaledPixels(360),
    },
    thumbnailPlaceholder: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      width: '100%',
      height: '100%',
      borderRadius: scaledPixels(5),
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
      right: 0,
      top: 0,
      height: '100%',
    },
    gradientBottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '15%',
    },
    headerTextContainer: {
      position: 'absolute',
      left: scaledPixels(40),
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      width: '50%',
    },
    highlightsList: {
      paddingLeft: scaledPixels(20),
    },
    cardImage: {
      width: '100%',
      height: '70%',
      borderTopLeftRadius: scaledPixels(10),
      borderTopRightRadius: scaledPixels(10),
    },
  });
