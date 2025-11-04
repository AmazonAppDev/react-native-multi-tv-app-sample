import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SpatialNavigationRoot, SpatialNavigationNode, DefaultFocus } from 'react-tv-space-navigation';
import { useIsFocused } from '@react-navigation/native';
import { scaledPixels } from '../hooks/useScale';
import { colors, safeZones } from '../theme';
import FocusablePressable from '../components/FocusablePressable';
import { useState } from 'react';

export default function SettingsScreen() {
  const isFocused = useIsFocused();
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  const qualityOptions = ['Auto', '1080p', '720p', '480p'];

  return (
    <SpatialNavigationRoot isActive={isFocused}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Settings</Text>

          {/* Video Quality Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video Quality</Text>
            <SpatialNavigationNode>
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
            <SpatialNavigationNode>
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
            <SpatialNavigationNode>
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
        </ScrollView>
      </View>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    paddingVertical: scaledPixels(safeZones.titleSafe.vertical),
    paddingBottom: scaledPixels(100),
  },
  title: {
    fontSize: scaledPixels(56),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: scaledPixels(48),
  },
  section: {
    marginBottom: scaledPixels(56),
  },
  sectionTitle: {
    fontSize: scaledPixels(32),
    fontWeight: '600',
    color: colors.text,
    marginBottom: scaledPixels(24),
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
