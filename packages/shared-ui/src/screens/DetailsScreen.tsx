import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View, Image, Text } from 'react-native';
import { SpatialNavigationRoot } from 'react-tv-space-navigation';
import { scaledPixels } from '../hooks/useScale';
import { useCallback, useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import FocusablePressable from '../components/FocusablePressable';
import { RootStackParamList } from '../navigation/types';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const { title, description, movie, headerImage } = route.params;

  const isFocused = useIsFocused();

  // Memoize image source to prevent unnecessary re-renders
  const imageSource = useMemo(() => ({ uri: headerImage }), [headerImage]);

  // Memoize button style to prevent unnecessary re-renders
  const buttonStyle = useMemo(
    () => ({ paddingHorizontal: scaledPixels(30) }),
    [],
  );

  const navigate = useCallback(() => {
    navigation.navigate('Player', {
      movie: movie,
      headerImage: headerImage,
    });
  }, [navigation, movie, headerImage]);

  return (
    <SpatialNavigationRoot isActive={isFocused}>
      <View style={detailsStyles.container}>
        <Image source={imageSource} style={detailsStyles.backgroundImage} />
        <View style={detailsStyles.contentContainer}>
          <View style={detailsStyles.topContent}>
            <Text style={detailsStyles.title}>{title}</Text>
            <Text style={detailsStyles.description}>{description}</Text>
          </View>
          <View style={detailsStyles.bottomContent}>
            <View style={detailsStyles.crewContainer}>
              <View style={detailsStyles.crewMember}>
                <Text style={detailsStyles.crewRole}>Director</Text>
                <Text style={detailsStyles.crewName}>Chris Traganos</Text>
              </View>
              <View style={detailsStyles.crewMember}>
                <Text style={detailsStyles.crewRole}>Executive Producer</Text>
                <Text style={detailsStyles.crewName}>Gio Laquidara</Text>
              </View>
              <View style={detailsStyles.crewMember}>
                <Text style={detailsStyles.crewRole}>Star</Text>
                <Text style={detailsStyles.crewName}>Eric Fahsl</Text>
              </View>
            </View>
            <FocusablePressable
              text={'Watch now'}
              onSelect={navigate}
              style={buttonStyle}
            />
          </View>
        </View>
      </View>
    </SpatialNavigationRoot>
  );
}

const detailsStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.3,
    },
    contentContainer: {
      flex: 1,
      padding: scaledPixels(40),
      justifyContent: 'space-between',
    },
    topContent: {
      marginTop: scaledPixels(600),
    },
    bottomContent: {
      marginBottom: scaledPixels(40),
    },
    title: {
      fontSize: scaledPixels(48),
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: scaledPixels(20),
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    description: {
      fontSize: scaledPixels(24),
      color: '#fff',
      marginBottom: scaledPixels(20),
      width: '60%',
      lineHeight: scaledPixels(32),
    },
    crewContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: scaledPixels(30),
    },
    crewMember: {
      marginRight: scaledPixels(40),
      marginBottom: scaledPixels(15),
    },
    crewRole: {
      fontSize: scaledPixels(16),
      color: '#aaa',
      fontWeight: '600',
    },
    crewName: {
      fontSize: scaledPixels(24),
      color: '#fff',
      fontWeight: 'bold',
    },
    watchButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      paddingVertical: scaledPixels(15),
      paddingHorizontal: scaledPixels(30),
      borderRadius: scaledPixels(5),
      alignSelf: 'flex-start',
    },
    watchButtonFocused: {
      backgroundColor: '#fff',
    },
    watchButtonText: {
      color: '#fff',
      fontSize: scaledPixels(18),
      fontWeight: 'bold',
    },
    watchButtonTextFocused: {
      color: '#000',
      fontSize: scaledPixels(18),
      fontWeight: 'bold',
    },
  });
