import { StyleSheet, View, Text, Image } from 'react-native';
import {
  SpatialNavigationRoot,
  SpatialNavigationNode,
  SpatialNavigationScrollView,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { DrawerActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../hooks/useScale';
import { colors, safeZones } from '../theme';
import FocusablePressable from '../components/FocusablePressable';
import { useCallback, useState } from 'react';
import { useMenuContext } from '../components/MenuContext';

export default function SettingsScreen() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  const qualityOptions = ['Auto', '1080p', '720p', '480p'];

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === 'left') {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, navigation],
  );

  return (
    <SpatialNavigationRoot
      isActive={isFocused && !isMenuOpen}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Settings</Text>
          <SpatialNavigationScrollView style={styles.scrollView}>
            <View style={styles.scrollContent}>
              {/* Video Quality Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Video Quality</Text>
                <SpatialNavigationNode orientation="horizontal">
                  <View style={styles.optionsRow}>
                    {qualityOptions.map((quality, index) => (
                      index === 0 ? (
                        <DefaultFocus key={quality}>
                          <FocusablePressable
                            text={quality}
                            onSelect={() => setSelectedQuality(quality)}
                            style={[
                              styles.optionButton,
                              selectedQuality === quality && styles.selectedOption,
                            ]}
                          />
                        </DefaultFocus>
                      ) : (
                        <FocusablePressable
                          key={quality}
                          text={quality}
                          onSelect={() => setSelectedQuality(quality)}
                          style={[
                            styles.optionButton,
                            selectedQuality === quality && styles.selectedOption,
                          ]}
                        />
                      )
                    ))}
                  </View>
                </SpatialNavigationNode>
              </View>

              {/* Playback Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Playback</Text>
                <SpatialNavigationNode orientation="vertical">
                  <View style={styles.optionsColumn}>
                    <FocusablePressable
                      text={`Autoplay: ${autoplay ? 'On' : 'Off'}`}
                      onSelect={() => setAutoplay(!autoplay)}
                      style={styles.toggleButton}
                    />
                    <FocusablePressable
                      text={`Notifications: ${notifications ? 'On' : 'Off'}`}
                      onSelect={() => setNotifications(!notifications)}
                      style={styles.toggleButton}
                    />
                  </View>
                </SpatialNavigationNode>
              </View>

              {/* About Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Version</Text>
                    <Text style={styles.infoValue}>1.0.0</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Build</Text>
                    <Text style={styles.infoValue}>2025.11.04</Text>
                  </View>
                </View>
              </View>

              {/* Actions Section */}
              <View style={styles.section}>
                <SpatialNavigationNode orientation="vertical">
                  <View style={styles.optionsColumn}>
                    <FocusablePressable
                      text="Clear Cache"
                      onSelect={() => console.log('Clear cache')}
                      style={styles.actionButton}
                    />
                    <FocusablePressable
                      text="Sign Out"
                      onSelect={() => console.log('Sign out')}
                      style={styles.actionButton}
                    />
                  </View>
                </SpatialNavigationNode>
              </View>
            </View>
          </SpatialNavigationScrollView>
        </View>
      </View>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 100,
  },
  headerContainer: {
    width: '100%',
    height: scaledPixels(700),
    position: 'relative',
  },
  backgroundImage: {
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
    height: '100%',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: scaledPixels(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    paddingTop: scaledPixels(16),
    paddingBottom: scaledPixels(safeZones.actionSafe.vertical + 60),
  },
  title: {
    fontSize: scaledPixels(48),
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    marginBottom: scaledPixels(32),
  },
  section: {
    marginBottom: scaledPixels(40),
  },
  sectionTitle: {
    fontSize: scaledPixels(28),
    fontWeight: '600',
    color: colors.text,
    marginBottom: scaledPixels(20),
  },
  optionsRow: {
    flexDirection: 'row',
    gap: scaledPixels(16),
    flexWrap: 'wrap',
  },
  optionsColumn: {
    gap: scaledPixels(16),
  },
  optionButton: {
    marginRight: scaledPixels(12),
    marginBottom: scaledPixels(12),
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    minWidth: scaledPixels(300),
  },
  actionButton: {
    alignSelf: 'flex-start',
    minWidth: scaledPixels(250),
  },
  infoContainer: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(12),
    padding: scaledPixels(24),
    gap: scaledPixels(16),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: scaledPixels(24),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: scaledPixels(24),
    color: colors.text,
    fontWeight: '600',
  },
});
