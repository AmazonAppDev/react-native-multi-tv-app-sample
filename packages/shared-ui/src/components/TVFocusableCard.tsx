import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';
import { scaledPixels } from '../hooks/useScale';
import { colors } from '../theme/colors';

interface TVFocusableCardProps {
  imageUri: string;
  title: string;
  subtitle?: string;
  onSelect: () => void;
  onFocus?: () => void;
}

function TVFocusableCard({ imageUri, title, subtitle, onSelect, onFocus }: TVFocusableCardProps) {
  return (
    <SpatialNavigationFocusableView onSelect={onSelect} onFocus={onFocus}>
      {({ isFocused }) => (
        <View style={[styles.card, isFocused && styles.cardFocused]}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          <View style={styles.caption}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
            {isFocused ? <Text style={styles.selectHint}>PRESS SELECT TO WATCH</Text> : null}
          </View>
        </View>
      )}
    </SpatialNavigationFocusableView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: scaledPixels(420),
    height: scaledPixels(260),
    marginEnd: scaledPixels(20),
    backgroundColor: colors.card,
    borderRadius: scaledPixels(12),
    borderWidth: scaledPixels(5),
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  cardFocused: {
    borderColor: colors.focusBorder,
    borderWidth: scaledPixels(6),
    transform: [{ scale: 1.04 }],
    shadowColor: colors.focus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: scaledPixels(20),
    elevation: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  caption: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    backgroundColor: colors.scrimDark,
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(12),
  },
  title: {
    color: colors.text,
    fontSize: scaledPixels(24),
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: scaledPixels(18),
    marginTop: scaledPixels(4),
  },
  selectHint: {
    color: colors.text,
    fontSize: scaledPixels(16),
    fontWeight: '700',
    marginTop: scaledPixels(8),
  },
});

export default React.memo(TVFocusableCard);
