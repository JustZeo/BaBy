/**
 * Baby — HomeScreen Component
 * Main dashboard: Hero Phase Card, Pixel Pet Room, Today's Summary,
 * Daily Care Missions, Love XP & Level Progress, and Daily Love Quote.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import PhaseCard from '../../components/cards/PhaseCard';
import SummaryCard from '../../components/cards/SummaryCard';
import MissionCard from '../../components/cards/MissionCard';
import PetView from '../../components/pet/PetView';
import XPBadge from '../../components/common/XPBadge';
import PixelCard from '../../components/cards/PixelCard';
import FloatingHearts from '../../components/common/FloatingHearts';
import Header from '../../components/common/Header';
import {
  useProfile, useCycleState, useXP, usePet,
  useMissions, useAchievements,
} from '../../hooks/useStorage';
import { DAILY_QUOTES } from '../../constants';
import { updatePetEvolution } from '../../storage/xpSystem';
import { scheduleOfflineReminders } from '../../utils/notifications';
import * as Storage from '../../storage/storage';

export default function HomeScreen({ navigation }: any) {
  const { profile, reload: reloadProfile } = useProfile();
  const { cycleState } = useCycleState(profile);
  const { xp, loginBonus, recordCare, reload: reloadXP } = useXP();
  const { pet, save: savePet, reload: reloadPet } = usePet();
  const { missions, complete: completeMissionItem, reload: reloadMissions } = useMissions(
    cycleState?.currentPhase
  );
  const { check: checkAchieve } = useAchievements();

  const [refreshing, setRefreshing] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');

  // Set daily quote based on day of year
  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const quote = DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
    setDailyQuote(quote);
  }, []);

  // Process daily login on mount
  useEffect(() => {
    (async () => {
      const earned = await loginBonus();
      if (cycleState) {
        const settings = await Storage.getSettings();
        await scheduleOfflineReminders(settings.notifications, cycleState.daysUntilNextPeriod);
      }
    })();
  }, [cycleState, loginBonus]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      reloadProfile(),
      reloadXP(),
      reloadPet(),
      reloadMissions(),
    ]);
    setRefreshing(false);
  }, [reloadMissions, reloadPet, reloadProfile, reloadXP]);

  // Handle completing a mission
  const handleToggleMission = async (missionId: string) => {
    const xpEarned = await completeMissionItem(missionId);
    if (xpEarned > 0) {
      // completeMissionItem already awards XP internally — re-fetch the
      // up-to-date value here instead of calling addXP again (that
      // previously double-counted the XP for every completed mission).
      const updatedXP = await Storage.getXP();
      await recordCare();

      // Check pet evolution
      const evolvedPet = updatePetEvolution(pet, updatedXP.currentLevel);
      await savePet(evolvedPet);

      // Check achievements
      await checkAchieve({
        careStreak: updatedXP.careStreak,
        totalLogs: 1,
        totalMissions: (missions?.completedCount || 0) + 1,
        totalJournals: 0,
        level: updatedXP.currentLevel,
        memoryFields: 0,
        cycleCount: 1,
      });
    }
  };

  if (!profile || !cycleState) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Baby...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FloatingHearts count={4} />

      {/* Screen Header */}
      <Header
        title="BABY"
        subtitle={`Supporting ${profile.girlfriendName} with love 💕`}
        emoji="🌸"
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
        }
      >
        {/* Hero Top Phase Card */}
        <PhaseCard profile={profile} cycleState={cycleState} />

        {/* Level, Love XP, & Streak Badges */}
        <XPBadge
          level={xp.currentLevel}
          totalXP={xp.totalXP}
          streak={xp.careStreak}
        />

        {/* Cute Pixel Pet inside Cozy Room */}
        <PetView
          pet={pet}
          currentPhase={cycleState.currentPhase}
          onPetTouch={() => {
            // Pet touch gives a tiny happiness boost
            savePet({
              ...pet,
              happiness: Math.min(100, pet.happiness + 1),
            });
          }}
        />

        {/* Daily Loving Quote Card */}
        <PixelCard style={styles.quoteCard} color="#FFFBF5">
          <View style={styles.quoteHeader}>
            <Text style={styles.quoteEmoji}>💌</Text>
            <Text style={styles.quoteTitle}>DAILY PARTNER REMINDER</Text>
          </View>
          <Text style={styles.quoteText}>{dailyQuote}</Text>
        </PixelCard>

        {/* Today's Summary & Hormone / Care Guide */}
        <SummaryCard currentPhase={cycleState.currentPhase} />

        {/* Daily Relationship Care Missions */}
        <MissionCard
          missionsData={missions}
          onToggleMission={handleToggleMission}
        />
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  quoteCard: {
    padding: SPACING.md,
    marginVertical: 4,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quoteEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  quoteTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.brownOutline,
  },
  quoteText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
