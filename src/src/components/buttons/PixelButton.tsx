/**
 * Baby — PixelButton Component
 * Pixel-styled pressable button with scale animation and optional haptic feedback.
 */

import React, { useCallback } from 'react';
import {
  Pressable, Text, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, PIXEL_BORDER, SHADOWS } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PixelButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export default function PixelButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
  haptic = true,
}: PixelButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [haptic, onPress]);

  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        variantStyles.button,
        sizeStyles.button,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      <Text style={[styles.text, variantStyles.text, sizeStyles.text, textStyle]}>
        {icon ? `${icon} ` : ''}{title}
      </Text>
    </AnimatedPressable>
  );
}

function getVariantStyles(variant: string) {
  switch (variant) {
    case 'secondary':
      return {
        button: { backgroundColor: COLORS.secondary, borderColor: COLORS.brownOutline },
        text: { color: COLORS.text },
      };
    case 'accent':
      return {
        button: { backgroundColor: COLORS.accent, borderColor: COLORS.brownOutline },
        text: { color: COLORS.white },
      };
    case 'outline':
      return {
        button: { backgroundColor: 'transparent', borderColor: COLORS.brownOutline },
        text: { color: COLORS.text },
      };
    default:
      return {
        button: { backgroundColor: COLORS.primary, borderColor: COLORS.brownOutline },
        text: { color: COLORS.white },
      };
  }
}

function getSizeStyles(size: string) {
  switch (size) {
    case 'sm':
      return {
        button: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md } as ViewStyle,
        text: { fontSize: FONT_SIZES.xs } as TextStyle,
      };
    case 'lg':
      return {
        button: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING['2xl'] } as ViewStyle,
        text: { fontSize: FONT_SIZES.lg } as TextStyle,
      };
    default:
      return {
        button: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl } as ViewStyle,
        text: { fontSize: FONT_SIZES.sm } as TextStyle,
      };
  }
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.pixel,
  },
  text: {
    fontFamily: FONTS.pixel,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
