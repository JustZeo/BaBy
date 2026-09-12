/**
 * Baby — PetRoom Component
 * Cozy pixel life simulator room backdrop with wallpaper, wood floor, and furniture.
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Rect, Line, Circle } from 'react-native-svg';
import { COLORS, BORDER_RADIUS } from '../../constants/theme';
import { RoomState } from '../../types';

interface PetRoomProps {
  roomState: RoomState;
  children: React.ReactNode;
}

export default function PetRoom({ roomState, children }: PetRoomProps) {
  return (
    <View style={styles.roomContainer}>
      {/* Background Wallpaper Layer */}
      <View style={styles.wallLayer}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          {/* Base Wall Color */}
          <Rect x="0" y="0" width="100%" height="100%" fill="#FFF1E6" />

          {/* Cozy Wallpaper Stripes */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390].map((x, i) => (
            <Line
              key={i}
              x1={x}
              y1="0"
              x2={x}
              y2="100%"
              stroke="#FFE3D1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          ))}

          {/* Cozy Window */}
          <Rect x="20" y="16" width="56" height="48" fill="#6F4E37" rx="4" />
          <Rect x="24" y="20" width="48" height="40" fill="#D6F0FF" />
          {/* Window Frame Panes */}
          <Line x1="48" y1="20" x2="48" y2="60" stroke="#6F4E37" strokeWidth="2" />
          <Line x1="24" y1="40" x2="72" y2="40" stroke="#6F4E37" strokeWidth="2" />
          {/* Cloud in window */}
          <Circle cx="38" cy="30" r="6" fill="#FFFFFF" opacity={0.8} />
          <Circle cx="44" cy="28" r="8" fill="#FFFFFF" opacity={0.8} />

          {/* Star garland hanging from top */}
          <Line x1="0" y1="8" x2="100%" y2="8" stroke="#6F4E37" strokeWidth="1" strokeDasharray="2 3" />
        </Svg>

        {/* Small Plant Pot */}
        <View style={styles.plantPot}>
          <Text style={{ fontSize: 20 }}>🪴</Text>
        </View>

        {/* Fairy Lamp */}
        <View style={styles.lamp}>
          <Text style={{ fontSize: 20 }}>🏮</Text>
        </View>
      </View>

      {/* Wooden Floor Layer */}
      <View style={styles.floorLayer}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          {/* Base Floorboard Color */}
          <Rect x="0" y="0" width="100%" height="100%" fill="#E3B792" />
          {/* Baseboard Moulding */}
          <Rect x="0" y="0" width="100%" height="4" fill="#6F4E37" />
          {/* Floor Planks lines */}
          <Line x1="0" y1="18" x2="100%" y2="18" stroke="#6F4E37" strokeWidth="1" opacity={0.35} />
          <Line x1="0" y1="36" x2="100%" y2="36" stroke="#6F4E37" strokeWidth="1" opacity={0.35} />
          <Line x1="0" y1="54" x2="100%" y2="54" stroke="#6F4E37" strokeWidth="1" opacity={0.35} />
          {/* Vertical plank joints */}
          <Line x1="70" y1="4" x2="70" y2="18" stroke="#6F4E37" strokeWidth="1" opacity={0.3} />
          <Line x1="180" y1="18" x2="180" y2="36" stroke="#6F4E37" strokeWidth="1" opacity={0.3} />
          <Line x1="110" y1="36" x2="110" y2="54" stroke="#6F4E37" strokeWidth="1" opacity={0.3} />
        </Svg>

        {/* Cute Cozy Rug in center */}
        <View style={styles.rug} />
      </View>

      {/* Foreground Content (Pet & Speech bubble) */}
      <View style={styles.contentOverlay}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  roomContainer: {
    height: 220,
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  wallLayer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  plantPot: {
    position: 'absolute',
    right: 24,
    bottom: 2,
  },
  lamp: {
    position: 'absolute',
    left: 88,
    top: 14,
  },
  floorLayer: {
    height: 80,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rug: {
    position: 'absolute',
    bottom: 12,
    width: 140,
    height: 52,
    backgroundColor: '#FFE3E8',
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: 26,
    opacity: 0.9,
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 14,
  },
});
