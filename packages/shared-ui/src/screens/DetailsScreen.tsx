import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View, Image, Text } from 'react-native';
import { SpatialNavigationRoot, DefaultFocus } from 'react-tv-space-navigation';
import { scaledPixels } from '../hooks/useScale';
import { useCallback, useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import FocusablePressable from '../components/FocusablePressable';
import { RootStackParamList } from '../navigation/types';
import { safeZones, colors } from '../theme';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const {
    title,
    description,
    movie,
    headerImage,
    category,
    genres,
    releaseYear,
    rating,
    ratingCount,
    contentRating,
    duration
  } = route.params;

  const isFocused = useIsFocused();

  // Memoize image source to prevent unnecessary re-renders
  const imageSource = useMemo(() => ({ uri: headerImage }), [headerImage]);

  // Memoize button style to prevent unnecessary re-renders
  const buttonStyle = useMemo(
    () => ({ paddingHorizontal: scaledPixels(30) }),
    [],
  );

  // Format duration from seconds to human-readable format
  const formattedDuration = useMemo(() => {
    if (!duration) return '';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  }, [duration]);

  // Format rating display
  const ratingDisplay = useMemo(() => {
    if (!rating) return '';
    return `${rating.toFixed(1)} ⭐ (${ratingCount || 0} ratings)`;
  }, [rating, ratingCount]);

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

            {/* Metadata row */}
            <View style={detailsStyles.metadataRow}>
              {releaseYear && (
                <Text style={detailsStyles.metadataText}>{releaseYear}</Text>
              )}
              {contentRating && (
                <Text style={detailsStyles.metadataText}>{contentRating}</Text>
              )}
              {formattedDuration && (
                <Text style={detailsStyles.metadataText}>{formattedDuration}</Text>
              )}
              {ratingDisplay && (
                <Text style={detailsStyles.metadataText}>{ratingDisplay}</Text>
              )}
            </View>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <View style={detailsStyles.genresContainer}>
                {genres.map((genre, index) => (
                  <View key={index} style={detailsStyles.genreTag}>
                    <Text style={detailsStyles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            )}

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
            <DefaultFocus>
              <FocusablePressable
                text={'Watch now'}
                onSelect={navigate}
                style={buttonStyle}
              />
            </DefaultFocus>
          </View>
        </View>
      </View>
    </SpatialNavigationRoot>
  );
}

const detailsStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.25,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
      paddingTop: scaledPixels(safeZones.titleSafe.vertical),
      paddingBottom: scaledPixels(safeZones.actionSafe.vertical),
      justifyContent: 'flex-end',
    },
    topContent: {
      flex: 1,
      justifyContent: 'center',
    },
    bottomContent: {
      paddingBottom: scaledPixels(20),
    },
    title: {
      fontSize: scaledPixels(64),
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: scaledPixels(24),
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 12,
    },
    description: {
      fontSize: scaledPixels(28),
      color: colors.text,
      marginBottom: scaledPixels(32),
      width: '65%',
      lineHeight: scaledPixels(40),
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    metadataRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: scaledPixels(16),
      gap: scaledPixels(16),
    },
    metadataText: {
      fontSize: scaledPixels(22),
      color: colors.textSecondary,
      fontWeight: '600',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    genresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: scaledPixels(20),
      gap: scaledPixels(12),
    },
    genreTag: {
      backgroundColor: colors.cardElevated,
      paddingHorizontal: scaledPixels(16),
      paddingVertical: scaledPixels(8),
      borderRadius: scaledPixels(20),
      borderWidth: scaledPixels(1),
      borderColor: colors.focusBorder,
    },
    genreText: {
      fontSize: scaledPixels(18),
      color: colors.text,
      fontWeight: '600',
    },
    crewContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: scaledPixels(40),
      gap: scaledPixels(48),
    },
    crewMember: {
      marginBottom: scaledPixels(16),
    },
    crewRole: {
      fontSize: scaledPixels(20),
      color: colors.textSecondary,
      fontWeight: '600',
      marginBottom: scaledPixels(4),
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    crewName: {
      fontSize: scaledPixels(28),
      color: colors.text,
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 6,
    },
    watchButton: {
      backgroundColor: colors.cardElevated,
      paddingVertical: scaledPixels(20),
      paddingHorizontal: scaledPixels(40),
      borderRadius: scaledPixels(8),
      alignSelf: 'flex-start',
    },
    watchButtonFocused: {
      backgroundColor: colors.focusBackground,
    },
    watchButtonText: {
      color: colors.text,
      fontSize: scaledPixels(24),
      fontWeight: 'bold',
    },
    watchButtonTextFocused: {
      color: colors.textOnPrimary,
      fontSize: scaledPixels(24),
      fontWeight: 'bold',
    },
  });
