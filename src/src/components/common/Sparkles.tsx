/**
 * Baby — Sparkles Component
 * Tiny retro pixel sparkle stars that twinkle.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface SparkleProps {
  x: number;
  y: number;
  size?: number;
  delay?: number;
  color?: string;
}

export function SingleSparkle({ x, y, size = 12, delay = 0, color = COLORS.warning }: SparkleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600 }),
          withTiming(0, { duration: 600 })
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0, { duration: 600 })
        ),
        -1,
        false
      )
    );

    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(90, { duration: 1200 }),
        -1,
        false
      )
    );
  }, [delay, opacity, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const half = size / 2;
  const unit = size / 4;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.sparkle,
        { left: x, top: y, width: size, height: size },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Center pixel */}
        <Rect x={unit} y={unit} width={unit * 2} height={unit * 2} fill={color} />
        {/* 4 cardinal points */}
        <Rect x={unit} y={0} width={unit * 2} height={unit} fill={color} />
        <Rect x={unit} y={unit * 3} width={unit * 2} height={unit} fill={color} />
        <Rect x={0} y={unit} width={unit} height={unit * 2} fill={color} />
        <Rect x={unit * 3} y={unit} width={unit} height={unit * 2} fill={color} />
      </Svg>
    </Animated.View>
  );
}

export default function SparklesGroup({ count = 3 }: { count?: number }) {
  const coords = [
    { x: 15, y: 10, delay: 200 },
    { x: 140, y: 5, delay: 700 },
    { x: 260, y: 15, delay: 1100 },
  ].slice(0, count);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {coords.map((c, i) => (
        <SingleSparkle key={i} {...c} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sparkle: {
    position: 'absolute',
  },
});
