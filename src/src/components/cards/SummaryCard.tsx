/**
 * Baby — SummaryCard Component
 * Respectfully displays Current Hormones, Possible Feelings, and Suggested Care.
 * Always maintains supportive, non-prescriptive language:
 * "She may feel...", "Common experiences include...", "Some people notice..."
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PixelCard from './PixelCard';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { CyclePhase } from '../../types';
import { PHASE_DATA } from '../../constants';

interface SummaryCardProps {
  currentPhase: CyclePhase;
}

export default function SummaryCard({ currentPhase }: SummaryCardProps) {
  const phaseInfo = PHASE_DATA[currentPhase] || PHASE_DATA.follicular;

  return (
    <PixelCard style={styles.card}>
      {/* Title */}
      <View style={styles.headerRow}>
        <Text style={styles.headerEmoji}>📖</Text>
        <Text style={styles.headerTitle}>TODAY'S SUMMARY</Text>
      </View>

      {/* What's Happening */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's Happening</Text>
        <Text style={styles.bodyText}>{phaseInfo.whatsHappening}</Text>
      </View>

      {/* Current Hormones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Hormones</Text>
        <View style={styles.hormonesRow}>
          {phaseInfo.hormones.map((h, index) => (
            <View key={index} style={styles.hormoneTag}>
              <Text style={styles.hormoneName}>{h.name}</Text>
              <Text style={styles.hormoneLevel}>{h.level}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Possible Feelings / Experiences (Always respectful language) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>She May Feel (Common Experiences)</Text>
        <Text style={styles.subNote}>*Every body is unique. Some people notice:</Text>
        <View style={styles.pillContainer}>
          {phaseInfo.possibleExperiences.map((exp, index) => (
            <View key={index} style={styles.experiencePill}>
              <Text style={styles.experienceText}>• {exp}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Suggested Care / Partner Tips */}
      <View style={styles.sectionLast}>
        <Text style={styles.sectionTitle}>Suggested Care for Her</Text>
        {phaseInfo.partnerTips.slice(0, 4).map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            <Text style={styles.tipHeart}>💖</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </PixelCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.whiteCard,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.secondary,
    paddingBottom: SPACING.xs,
  },
  headerEmoji: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  headerTitle: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionLast: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 10,
    color: COLORS.brownOutline,
    marginBottom: 4,
  },
  bodyText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    lineHeight: 20,
  },
  subNote: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  hormonesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  hormoneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    gap: 4,
  },
  hormoneName: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.text,
  },
  hormoneLevel: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  experiencePill: {
    backgroundColor: '#FFF0F3',
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  experienceText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#FFF7F1',
    padding: 6,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#FFE3D1',
  },
  tipHeart: {
    fontSize: 12,
    marginRight: 6,
  },
  tipText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    flex: 1,
  },
});
