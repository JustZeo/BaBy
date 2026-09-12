/**
 * Baby — PixelCard Component
 * Base card with pixel-art brown outline, cream background, cozy shadow.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, PIXEL_BORDER, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface PixelCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  color?: string;
  noPadding?: boolean;
}

export default function PixelCard({ children, style, color, noPadding }: PixelCardProps) {
  return (
    <View
      style={[
        styles.card,
        color ? { backgroundColor: color } : undefined,
        noPadding ? { padding: 0 } : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.whiteCard,
    ...PIXEL_BORDER,
    ...SHADOWS.pixel,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
  },
});
