/**
 * Baby — FloatingHearts Component
 * Cozy floating hearts micro-animation in the background or overlay.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeartProps {
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

function HeartItem({ startX, startY, size, duration, delay, color }: HeartProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-120, { duration, easing: Easing.out(Easing.quad) }),
        -1,
        false
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(12, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
          withTiming(-12, { duration: duration / 2, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: duration * 0.2 }),
          withTiming(0.7, { duration: duration * 0.5 }),
          withTiming(0, { duration: duration * 0.3 })
        ),
        -1,
        false
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: duration * 0.5 }),
          withTiming(0.9, { duration: duration * 0.5 })
        ),
        -1,
        true
      )
    );
  }, [delay, duration, opacity, scale, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.heart,
        { left: startX, top: startY, width: size, height: size },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        {/* Pixel style heart path */}
        <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </Svg>
    </Animated.View>
  );
}

export default function FloatingHearts({ count = 5 }: { count?: number }) {
  const hearts = [
    { startX: 25, startY: 90, size: 14, duration: 4200, delay: 0, color: '#F6B6C8' },
    { startX: SCREEN_WIDTH - 60, startY: 130, size: 16, duration: 4800, delay: 900, color: '#FFD6E0' },
    { startX: SCREEN_WIDTH / 2 - 20, startY: 80, size: 12, duration: 3800, delay: 1800, color: '#E96B7A' },
    { startX: 70, startY: 150, size: 15, duration: 4500, delay: 2400, color: '#F6B6C8' },
    { startX: SCREEN_WIDTH - 100, startY: 70, size: 13, duration: 5200, delay: 1200, color: '#FFD6E0' },
  ].slice(0, count);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {hearts.map((h, i) => (
        <HeartItem key={i} {...h} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heart: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
