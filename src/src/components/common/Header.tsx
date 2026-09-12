/**
 * Baby — Header Component
 * Pixel-styled header with icon, title, subtitle, and optional right actions.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../constants/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export default function Header({ title, subtitle, emoji, rightElement, style }: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleRow}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
    marginTop: 2,
  },
  right: {
    marginLeft: SPACING.sm,
  },
});
