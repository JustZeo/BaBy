/**
 * Baby — PetView Component
 * Renders the pixel pet in its cozy room with interactive speech bubble.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PetRoom from './PetRoom';
import PixelArtCat from './PixelArtCat';
import { PetState, CyclePhase } from '../../types';
import { PET_DIALOGUES } from '../../constants';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface PetViewProps {
  pet: PetState;
  currentPhase: CyclePhase;
  onPetTouch?: () => void;
}

export default function PetView({ pet, currentPhase, onPetTouch }: PetViewProps) {
  const [speech, setSpeech] = useState<string>("I'm cheering for both of you! 💕");
  const heartScale = useSharedValue(0);

  // Pick initial speech matching current phase
  useEffect(() => {
    const phaseQuotes = PET_DIALOGUES[currentPhase] || PET_DIALOGUES.greetings;
    const randomQuote = phaseQuotes[Math.floor(Math.random() * phaseQuotes.length)];
    setSpeech(randomQuote);
  }, [currentPhase]);

  const handlePetPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Heart bounce animation
    heartScale.value = 1.3;
    heartScale.value = withSpring(0, { damping: 10 });

    // Pick new dialogue
    const pool = [...(PET_DIALOGUES[currentPhase] || []), ...PET_DIALOGUES.greetings];
    const newQuote = pool[Math.floor(Math.random() * pool.length)];
    setSpeech(newQuote);

    if (onPetTouch) onPetTouch();
  };

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartScale.value,
  }));

  return (
    <View style={styles.wrapper}>
      <PetRoom roomState={pet.room}>
        {/* Speech Bubble Above Pet */}
        <View style={styles.bubbleContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.petNameLabel}>{pet.name}:</Text>
            <Text style={styles.speechText}>{speech}</Text>
          </View>
          {/* Speech Bubble Tail */}
          <View style={styles.bubbleTail} />
        </View>

        {/* Floating Heart Effect on Tap */}
        <Animated.View style={[styles.tapHeart, heartAnimatedStyle]} pointerEvents="none">
          <Text style={{ fontSize: 26 }}>💖</Text>
        </Animated.View>

        {/* Interactive Pet */}
        <Pressable onPress={handlePetPress} style={styles.petPressable}>
          <PixelArtCat evolution={pet.evolution} mood={pet.mood} size={116} />
        </Pressable>
      </PetRoom>

      {/* Pet Status Pill Below */}
      <View style={styles.petStatusRow}>
        <View style={styles.statusPill}>
          <Text style={styles.statusEmoji}>✨</Text>
          <Text style={styles.statusText}>Stage: {pet.evolution.toUpperCase()}</Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusEmoji}>💕</Text>
          <Text style={styles.statusText}>Mood: {pet.mood}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },
  bubbleContainer: {
    alignItems: 'center',
    marginBottom: 4,
    maxWidth: '85%',
  },
  speechBubble: {
    backgroundColor: '#FFFDF9',
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...SHADOWS.pixel,
  },
  petNameLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.accent,
    marginBottom: 2,
  },
  speechText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  bubbleTail: {
    width: 8,
    height: 8,
    backgroundColor: '#FFFDF9',
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.brownOutline,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
  petPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHeart: {
    position: 'absolute',
    top: 55,
    zIndex: 10,
  },
  petStatusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  statusEmoji: {
    fontSize: 10,
    marginRight: 4,
  },
  statusText: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.text,
  },
});
