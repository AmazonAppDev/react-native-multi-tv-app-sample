import { StyleSheet, FlatList, View, Image, Text } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { useMenuContext } from '../../components/MenuContext';
import { SpatialNavigationFocusableView, SpatialNavigationRoot, SpatialNavigationScrollView, SpatialNavigationView, SpatialNavigationNode, SpatialNavigationVirtualizedList, SpatialNavigationVirtualizedListRef, DefaultFocus } from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '@/hooks/useScale';
import { LinearGradient } from 'expo-linear-gradient';


interface CardData {
  id: string;
  title: string;
  description: string;
  headerImage: string;
}

export default function IndexScreen() {
  const styles = useGridStyles();
  const router = useRouter();
  const navigation = useNavigation();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const trendingRef = useRef<SpatialNavigationVirtualizedListRef>(null);
  const classicsRef = useRef<SpatialNavigationVirtualizedListRef>(null);
  const hipAndModernRef = useRef<SpatialNavigationVirtualizedListRef>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  const focusedItem = useMemo(() => moviesData[focusedIndex], [focusedIndex]);

  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <Image 
        style={styles.headerImage}
        source={focusedItem.headerImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>{focusedItem.title}</Text>
        <Text style={styles.headerDescription}>{focusedItem.description}</Text>
      </View>
    </View>
  ), [focusedItem, styles]);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      console.log("Direction " + movement);
      if (movement === 'left' && focusedIndex === 0) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, focusedIndex, navigation],
  );

  const renderScrollableRow = useCallback((title: string, ref: React.RefObject<FlatList>) => {
    const renderItem = useCallback(({ item, index }: { item: CardData; index: number }) => (
      <SpatialNavigationFocusableView
        onSelect={() => { 
          router.push({
            pathname: '/details',
            params: { 
              title: item.title,
              description: item.description,
              headerImage: item.headerImage
            }         
           });
        }}
        onFocus={() => setFocusedIndex(index)}
      >
        {({ isFocused }) => (
          <View style={[styles.highlightThumbnail, isFocused && styles.highlightThumbnailFocused]}>
            <Image source={item.headerImage} style={styles.headerImage} />
            <View style={styles.thumbnailTextContainer}>
             <Text style={styles.thumbnailText}>{item.title}</Text>   
            </View>
          </View>
        )}
      </SpatialNavigationFocusableView>
    ), [router, styles]);

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
  }, [styles]);

  return (
    <SpatialNavigationRoot
      isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
        <View style={styles.container}>
        {renderHeader()}       
        <SpatialNavigationScrollView  
          offsetFromStart={scaledPixels(60)}  
          style={styles.scrollContent}>   
          {renderScrollableRow("Trending Movies", trendingRef)}
          {renderScrollableRow("Classics", classicsRef)}
          {renderScrollableRow("Hip and Modern", hipAndModernRef)}
        </SpatialNavigationScrollView>
        </View>
    </SpatialNavigationRoot> 
  );
}


const useGridStyles = function () {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    scrollContent: {
      flex: 1,
      marginTop: scaledPixels(10),
      marginBottom: scaledPixels(48)
    },
    highlightsTitle: {
      color: '#fff',
      fontSize: scaledPixels(34),
      fontWeight: 'bold',
      marginBottom: scaledPixels(10),
      marginTop: scaledPixels(30),
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
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
    headerTextContainer: {
      position: 'absolute',
      left: scaledPixels(40),  // Add left padding
      top: 0,
      bottom: 0,
      justifyContent: 'center',  // Center vertically
      width: '50%',  // Limit width to prevent overlap with right side
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
};

const moviesData = [
  {
    "id": 0,
    "title": "Wagon Train Warriors",    
    "description": "Pioneers face hardships and hostile forces on their journey westward.",
    "headerImage": require("@assets/images/movie.png"),
    "duration": 100    
  },
  {
    "id": 6,
    "title": "Frontier Hearts",
    "description": "Two families bond and clash while traveling together to settle new lands.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 130
  },
  {
    "id": 1,
    "title": "The Journey West",
    "description": "A family's perilous journey along the Oregon Trail to find a new home.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 110
  },
  {
    "id": 4,
    "title": "Trailblazers",
    "description": "Adventurous pioneers carve out new paths and face unknown perils in the wilderness.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 115
  },
  {
    "id": 2,
    "title": "Homestead Dreams",
    "description": "Settlers struggle to build a new life on the frontier amidst challenges and dangers.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 120
  },
  {
    "id": 3,
    "title": "Westward Bound",
    "description": "A group of pioneers battles the elements and each other on their trek west.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 95
  },

  {
    "id": 5,
    "title": "Prairie Odyssey",
    "description": "A young couple's journey to the west tests their love and determination.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 105
  },
  {
    "id": 7,
    "title": "Pioneer Spirit",
    "description": "A resilient widow leads a group of settlers to the promised land of the West.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 90
  },
  {
    "id": 9,
    "title": "The Great Migration",
    "description": "Hundreds of families embark on a mass migration to California during the Gold Rush.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 140
  },
  {
    "id": 10,
    "title": "Untamed Horizon",
    "description": "Pioneers face unpredictable challenges as they seek a new beginning in the West.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 100
  },
  {
    "id": 11,
    "title": "Endless Prairie",
    "description": "A group of settlers confronts endless prairies and relentless weather on their journey.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 115
  },
  {
    "id": 12,
    "title": "Crossing the Divide",
    "description": "Families face immense trials as they cross the Continental Divide.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 120
  },
  {
    "id": 13,
    "title": "Frontier Faith",
    "description": "A preacher and his flock encounter trials of faith on their way to the West.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 100
  },
  {
    "id": 14,
    "title": "Pioneer's Path",
    "description": "A young pioneer girl narrates her family's adventures and struggles on the frontier.",
    "headerImage": require("@/assets/images/movie.png"),
    "duration": 85
  }
]

