/**
 * Baby — OnboardingScreen Component
 * Welcomes the boyfriend on first launch with cozy pixel art and collects initial info:
 * Girlfriend's name, average cycle length, and last period start date.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import PixelButton from '../../components/buttons/PixelButton';
import PixelCard from '../../components/cards/PixelCard';
import PixelArtCat from '../../components/pet/PixelArtCat';
import SparklesGroup from '../../components/common/Sparkles';
import FloatingHearts from '../../components/common/FloatingHearts';
import { UserProfile } from '../../types';
import { format } from 'date-fns';

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [name, setName] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [daysAgo, setDaysAgo] = useState('7');

  const handleFinish = () => {
    const girlfriendName = name.trim() || 'My Girlfriend';
    const cLen = parseInt(cycleLength, 10) || 28;
    const pLen = parseInt(periodLength, 10) || 5;
    const ago = parseInt(daysAgo, 10) || 7;

    const lastPeriodDate = new Date();
    lastPeriodDate.setDate(lastPeriodDate.getDate() - ago);
    const lastPeriodStart = format(lastPeriodDate, 'yyyy-MM-dd');

    const profile: UserProfile = {
      girlfriendName,
      averageCycleLength: cLen,
      averagePeriodLength: pLen,
      lastPeriodStart,
      createdAt: new Date().toISOString(),
      onboardingComplete: true,
    };

    onComplete(profile);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FloatingHearts count={6} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SparklesGroup count={3} />

        {/* Welcome Header */}
        <View style={styles.welcomeContainer}>
          <PixelArtCat evolution="baby" mood="happy" size={100} />
          <Text style={styles.appTitle}>BABY</Text>
          <Text style={styles.tagline}>
            A cozy guide to understanding and caring for your girlfriend throughout her cycle.
          </Text>
        </View>

        {/* Privacy & Respect Notice */}
        <PixelCard style={styles.noticeCard} color="#FFF5F7">
          <Text style={styles.noticeEmoji}>🔒 100% Private & Offline</Text>
          <Text style={styles.noticeText}>
            No accounts, no cloud, no internet needed. All data stays safe on your device only.
          </Text>
        </PixelCard>

        {/* Form Card */}
        <PixelCard style={styles.formCard}>
          <Text style={styles.formTitle}>LET'S GET STARTED</Text>

          {/* Girlfriend's Name */}
          <View style={styles.field}>
            <Text style={styles.label}>❤️ HER NAME OR NICKNAME:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Baby, Emma, Babe..."
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          {/* Average Cycle Length */}
          <View style={styles.field}>
            <Text style={styles.label}>🔄 AVERAGE CYCLE LENGTH (DAYS):</Text>
            <Text style={styles.hint}>Most cycles are between 24-35 days (default is 28):</Text>
            <TextInput
              style={styles.input}
              value={cycleLength}
              onChangeText={setCycleLength}
              keyboardType="number-pad"
              placeholder="28"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          {/* Average Period Duration */}
          <View style={styles.field}>
            <Text style={styles.label}>🩸 PERIOD DURATION (DAYS):</Text>
            <Text style={styles.hint}>Usually 3-7 days (default is 5):</Text>
            <TextInput
              style={styles.input}
              value={periodLength}
              onChangeText={setPeriodLength}
              keyboardType="number-pad"
              placeholder="5"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          {/* Last Period Start Estimate */}
          <View style={styles.field}>
            <Text style={styles.label}>📅 LAST PERIOD BEGAN APPROXIMATELY:</Text>
            <Text style={styles.hint}>How many days ago did her last period start?</Text>
            <TextInput
              style={styles.input}
              value={daysAgo}
              onChangeText={setDaysAgo}
              keyboardType="number-pad"
              placeholder="7"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          {/* Continue Button */}
          <PixelButton
            title="START JOURNEY ❤️"
            onPress={handleFinish}
            variant="accent"
            size="lg"
            style={styles.submitBtn}
          />
        </PixelCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  appTitle: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    letterSpacing: 1,
    marginTop: SPACING.sm,
  },
  tagline: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
    lineHeight: 20,
  },
  noticeCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  noticeEmoji: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.accent,
    marginBottom: 4,
  },
  noticeText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md + 1,
    color: COLORS.text,
    lineHeight: 18,
  },
  formCard: {
    padding: SPACING.lg,
  },
  formTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 11,
    color: COLORS.brownOutline,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  field: {
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.text,
    marginBottom: 2,
  },
  hint: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFDF9',
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  submitBtn: {
    marginTop: SPACING.sm,
  },
});
