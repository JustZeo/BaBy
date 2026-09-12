/**
 * Baby — PixelArtCat Component
 * Hand-crafted SVG pixel cat with evolution stages and emotion animations.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Rect, Path } from 'react-native-svg';
import { PetEvolution, PetMood } from '../../types';

interface PixelArtCatProps {
  evolution: PetEvolution;
  mood: PetMood;
  size?: number;
}

export default function PixelArtCat({
  evolution = 'baby',
  mood = 'happy',
  size = 110,
}: PixelArtCatProps) {
  const bounceY = useSharedValue(0);
  const breathScale = useSharedValue(1);

  useEffect(() => {
    // Gentle idle breathing & subtle bounce
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.98, { duration: 1600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [bounceY, breathScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { scaleY: breathScale.value },
    ],
  }));

  const scale = size / 32; // base resolution 32x32

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 32 32">
        {renderPetByEvolution(evolution, mood)}
      </Svg>
    </Animated.View>
  );
}

function renderPetByEvolution(evolution: PetEvolution, mood: PetMood) {
  if (evolution === 'egg') {
    return (
      <>
        {/* Shadow */}
        <Rect x="8" y="27" width="16" height="3" fill="#6F4E37" opacity={0.25} />
        {/* Egg outline */}
        <Rect x="12" y="7" width="8" height="2" fill="#6F4E37" />
        <Rect x="9" y="9" width="14" height="3" fill="#6F4E37" />
        <Rect x="7" y="12" width="18" height="12" fill="#6F4E37" />
        <Rect x="9" y="24" width="14" height="3" fill="#6F4E37" />
        <Rect x="12" y="27" width="8" height="1" fill="#6F4E37" />

        {/* Egg fill */}
        <Rect x="13" y="8" width="6" height="2" fill="#FFF2E8" />
        <Rect x="10" y="10" width="12" height="3" fill="#FFF2E8" />
        <Rect x="8" y="13" width="16" height="10" fill="#FFF2E8" />
        <Rect x="10" y="23" width="12" height="3" fill="#FFF2E8" />

        {/* Pink Spots on egg */}
        <Rect x="11" y="12" width="3" height="3" fill="#F6B6C8" />
        <Rect x="18" y="16" width="3" height="3" fill="#F6B6C8" />
        <Rect x="13" y="20" width="4" height="2" fill="#FFC96B" />

        {/* Ribbon on egg */}
        <Rect x="8" y="17" width="16" height="2" fill="#E96B7A" />
        <Rect x="14" y="15" width="4" height="2" fill="#E96B7A" />
      </>
    );
  }

  // Base Cat (Baby, Teen, Adult, Legendary)
  const isLegendary = evolution === 'legendary';
  const isAdult = evolution === 'adult' || isLegendary;
  const bodyColor = isLegendary ? '#FFF6E0' : '#FFEDE1';
  const furAccent = isLegendary ? '#FFD700' : '#E8B498';
  const earPink = '#FFAAA6';

  return (
    <>
      {/* Soft Ground Shadow */}
      <Rect x="6" y="28" width="20" height="3" fill="#6F4E37" opacity={0.25} />

      {/* Tail with wag */}
      <Rect x="23" y="19" width="3" height="2" fill="#6F4E37" />
      <Rect x="25" y="16" width="3" height="4" fill="#6F4E37" />
      <Rect x="26" y="13" width="2" height="4" fill="#6F4E37" />
      <Rect x="24" y="19" width="1" height="2" fill={furAccent} />
      <Rect x="26" y="16" width="1" height="4" fill={furAccent} />

      {/* Cat Body Outline */}
      <Rect x="9" y="17" width="14" height="11" fill="#6F4E37" />
      <Rect x="8" y="19" width="16" height="8" fill="#6F4E37" />

      {/* Cat Body Fill */}
      <Rect x="10" y="18" width="12" height="9" fill={bodyColor} />
      <Rect x="9" y="20" width="14" height="6" fill={bodyColor} />
      {/* Belly Patch */}
      <Rect x="12" y="20" width="8" height="6" fill="#FFFFFF" />

      {/* Paws */}
      <Rect x="10" y="26" width="3" height="2" fill="#6F4E37" />
      <Rect x="19" y="26" width="3" height="2" fill="#6F4E37" />
      <Rect x="10" y="25" width="3" height="2" fill="#FFFFFF" />
      <Rect x="19" y="25" width="3" height="2" fill="#FFFFFF" />

      {/* Ears Outline */}
      <Rect x="7" y="5" width="4" height="4" fill="#6F4E37" />
      <Rect x="21" y="5" width="4" height="4" fill="#6F4E37" />
      {/* Ears Inner Pink */}
      <Rect x="8" y="6" width="2" height="2" fill={earPink} />
      <Rect x="22" y="6" width="2" height="2" fill={earPink} />

      {/* Head Outline */}
      <Rect x="7" y="8" width="18" height="10" fill="#6F4E37" />
      <Rect x="6" y="10" width="20" height="7" fill="#6F4E37" />

      {/* Head Fill */}
      <Rect x="8" y="9" width="16" height="8" fill={bodyColor} />
      <Rect x="7" y="11" width="18" height="5" fill={bodyColor} />

      {/* Forehead Stripe / Patch */}
      <Rect x="14" y="8" width="4" height="4" fill={furAccent} />

      {/* Eyes depending on Mood */}
      {renderEyes(mood)}

      {/* Cute Pink Cheeks */}
      <Rect x="8" y="14" width="2" height="1" fill="#FFB6C1" />
      <Rect x="22" y="14" width="2" height="1" fill="#FFB6C1" />

      {/* Nose & Mouth */}
      <Rect x="15" y="13" width="2" height="1" fill="#E96B7A" />
      <Rect x="14" y="14" width="1" height="1" fill="#6F4E37" />
      <Rect x="17" y="14" width="1" height="1" fill="#6F4E37" />

      {/* Whiskers */}
      <Rect x="5" y="12" width="2" height="1" fill="#6F4E37" />
      <Rect x="5" y="14" width="2" height="1" fill="#6F4E37" />
      <Rect x="25" y="12" width="2" height="1" fill="#6F4E37" />
      <Rect x="25" y="14" width="2" height="1" fill="#6F4E37" />

      {/* Collar / Bell */}
      {(evolution === 'teen' || isAdult) && (
        <>
          <Rect x="11" y="17" width="10" height="2" fill="#E96B7A" />
          <Rect x="15" y="18" width="2" height="2" fill="#FFD700" />
        </>
      )}

      {/* Adult Fluff */}
      {isAdult && (
        <>
          <Rect x="6" y="16" width="2" height="2" fill="#FFFFFF" />
          <Rect x="24" y="16" width="2" height="2" fill="#FFFFFF" />
        </>
      )}

      {/* Legendary Golden Crown & Aura */}
      {isLegendary && (
        <>
          <Rect x="12" y="2" width="8" height="4" fill="#FFD700" />
          <Rect x="12" y="1" width="2" height="2" fill="#FFD700" />
          <Rect x="15" y="0" width="2" height="2" fill="#FFD700" />
          <Rect x="18" y="1" width="2" height="2" fill="#FFD700" />
          {/* Jewel in Crown */}
          <Rect x="15" y="3" width="2" height="2" fill="#E96B7A" />
        </>
      )}
    </>
  );
}

function renderEyes(mood: PetMood) {
  if (mood === 'love') {
    return (
      <>
        {/* Heart Eyes */}
        <Rect x="10" y="11" width="3" height="3" fill="#E96B7A" />
        <Rect x="19" y="11" width="3" height="3" fill="#E96B7A" />
      </>
    );
  }

  if (mood === 'sleepy') {
    return (
      <>
        {/* Closed sleeping curves */}
        <Rect x="10" y="12" width="3" height="1" fill="#6F4E37" />
        <Rect x="19" y="12" width="3" height="1" fill="#6F4E37" />
      </>
    );
  }

  if (mood === 'excited') {
    return (
      <>
        {/* Star / Sparkle Eyes */}
        <Rect x="11" y="11" width="2" height="3" fill="#2D1F14" />
        <Rect x="10" y="12" width="4" height="1" fill="#2D1F14" />
        <Rect x="20" y="11" width="2" height="3" fill="#2D1F14" />
        <Rect x="19" y="12" width="4" height="1" fill="#2D1F14" />
      </>
    );
  }

  // Happy / Content default eyes with white glint
  return (
    <>
      <Rect x="10" y="11" width="3" height="3" fill="#2D1F14" />
      <Rect x="10" y="11" width="1" height="1" fill="#FFFFFF" />
      <Rect x="19" y="11" width="3" height="3" fill="#2D1F14" />
      <Rect x="19" y="11" width="1" height="1" fill="#FFFFFF" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
