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

type CardData = {
  id: string | number;
  title: string;
  description: string;
  headerImage: string;
  movie: string;
  duration?: number;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

export default function HomeScreen() {
  const styles = gridStyles;
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const trendingRef = useRef<SpatialNavigationVirtualizedListRef>(null);
  const classicsRef = useRef<SpatialNavigationVirtualizedListRef>(null);
  const hipAndModernRef = useRef<SpatialNavigationVirtualizedListRef>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  const focusedItem = useMemo(() => moviesData[focusedIndex], [focusedIndex]);

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <Image
          style={styles.headerImage}
          source={{
            uri: focusedItem.headerImage,
          }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientLeft}
        />
        <LinearGradient
          colors={['rgb(0,0,0)', 'rgba(0,0,0, 0.3)', 'transparent']}
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientBottom}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{focusedItem.title}</Text>
          <Text style={styles.headerDescription}>{focusedItem.description}</Text>
        </View>
      </View>
    ),
    [
      focusedItem.headerImage,
      focusedItem.title,
      focusedItem.description,
      styles.header,
      styles.gradientLeft,
      styles.gradientBottom,
    ],
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
            {({ isFocused }) => (
              <View style={[styles.highlightThumbnail, isFocused && styles.highlightThumbnailFocused]}>
                <Image source={{ uri: item.headerImage }} style={styles.headerImage} />
                <View style={styles.thumbnailTextContainer}>
                  <Text style={styles.thumbnailText}>{item.title}</Text>
                </View>
              </View>
            )}
          </SpatialNavigationFocusableView>
        ),
        [navigation, styles],
      );

      return (
        <View style={styles.highlightsContainer}>
          <Text style={styles.highlightsTitle}>{title}</Text>
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
    [styles, navigation, styles.headerImage, styles.thumbnailText],
  );

  return (
    <SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <View style={styles.container}>
        {renderHeader()}
        <SpatialNavigationScrollView offsetFromStart={scaledPixels(60)} style={styles.scrollContent}>
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

const moviesData = [
  {
    id: 0,
    title: 'Sintel',
    description:
      'Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender.',
    headerImage: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    movie: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 100,
  },
  {
    id: 1,
    title: 'Big Buck Bunny',
    description:
      "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition, he prepares the nasty rodents a comical revenge.",
    headerImage: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    movie: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 130,
  },
  {
    id: 2,
    title: 'We Are Going On Bullrun',
    description:
      'The Smoking Tire is going on the 2010 Bullrun Live Rally in a 2011 Shelby GT500, and posting a video from the road every single day!',
    headerImage: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg',
    movie: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    duration: 95,
  },
  {
    id: 3,
    title: 'Tears of Steel',
    description:
      'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. The goal was to test a complete open and free pipeline for visual effects in film.',
    headerImage: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    movie: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 115,
  },
  {
    id: 4,
    title: 'Volkswagen GTI Review',
    description:
      'The Smoking Tire heads out to Adams Motorsports Park in Riverside, CA to test the most requested car of 2010, the Volkswagen GTI.',
    headerImage: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg',
    movie: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    duration: 110,
  },
  {
    id: 5,
    title: 'Subaru Outback On Street And Dirt',
    description:
      'Smoking Tire takes the all-new Subaru Outback to the highest point we can find in hopes our customer-appreciation Balloon Launch will get some free T-shirts into the hands of our viewers.',
    headerImage:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
    movie: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    duration: 105,
  },
  {
    id: 6,
    title: 'Elephant Dream',
    description: 'The first Blender Open Movie from 2006.',
    headerImage: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    movie: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 90,
  },
  {
    id: 7,
    title: 'What Car Can You Get For A Grand?',
    description:
      'The Smoking Tire meets up with Chris and Jorge from CarsForAGrand.com to see just how far $1,000 can go when looking for a car.',
    headerImage:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WhatCarCanYouGetForAGrand.jpg',
    movie: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    duration: 90,
  },
];
