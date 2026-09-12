/**
 * Baby — JournalScreen Component
 * Relationship journal for capturing daily notes, special moments,
 * date ideas, gift ideas, future plans, and cherished memories.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Modal, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Header from '../../components/common/Header';
import PixelCard from '../../components/cards/PixelCard';
import PixelButton from '../../components/buttons/PixelButton';
import { useJournal, useXP } from '../../hooks/useStorage';
import { JournalEntry, JournalCategory, MoodType } from '../../types';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

const CATEGORIES: { id: JournalCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '🌟' },
  { id: 'daily_note', label: 'Daily Notes', emoji: '📝' },
  { id: 'special_moment', label: 'Moments', emoji: '💖' },
  { id: 'date_idea', label: 'Date Ideas', emoji: '☕' },
  { id: 'gift_idea', label: 'Gift Ideas', emoji: '🎁' },
  { id: 'future_plan', label: 'Future Plans', emoji: '✈️' },
  { id: 'memory', label: 'Memories', emoji: '📸' },
];

export default function JournalScreen({ navigation }: any) {
  const { entries, saveEntry, deleteEntry } = useJournal();
  const { addXP } = useXP();

  const [activeCategory, setActiveCategory] = useState<JournalCategory | 'all'>('all');
  const [modalVisible, setModalVisible] = useState(false);

  // New entry form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<JournalCategory>('daily_note');

  const filteredEntries = entries.filter(e =>
    activeCategory === 'all' ? true : e.category === activeCategory
  );

  const handleCreateEntry = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Details', 'Please write a title and a note for your entry.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newEntry: JournalEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      title: title.trim(),
      content: content.trim(),
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveEntry(newEntry);
    await addXP(10);

    setTitle('');
    setContent('');
    setModalVisible(false);

    Alert.alert('Saved to Journal! 📖', 'Earned +10 Love XP for cherishing this moment.');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Entry?',
      'Are you sure you want to remove this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await deleteEntry(id);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="RELATIONSHIP JOURNAL"
        subtitle="Cherishing your sweetest memories together"
        emoji="📖"
        rightElement={
          <PixelButton
            title="+ WRITE"
            onPress={() => setModalVisible(true)}
            variant="accent"
            size="sm"
          />
        }
      />

      {/* Category Pills Scroll */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveCategory(cat.id);
              }}
              style={[
                styles.categoryChip,
                activeCategory === cat.id && styles.categoryChipActive,
              ]}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.catLabel,
                  activeCategory === cat.id && styles.catLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Journal Entries List */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌸</Text>
            <Text style={styles.emptyTitle}>No Entries in this Category Yet</Text>
            <Text style={styles.emptySub}>
              Tap "+ WRITE" above to jot down a cute date idea, special moment, or daily thought!
            </Text>
          </View>
        ) : (
          filteredEntries.map(entry => (
            <PixelCard key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryCategoryBadge}>
                  <Text style={styles.entryCategoryText}>
                    {entry.category.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.entryDate}>{entry.date}</Text>
              </View>

              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryBody}>{entry.content}</Text>

              <View style={styles.entryFooter}>
                <Pressable onPress={() => handleDelete(entry.id)}>
                  <Text style={styles.deleteText}>🗑️ Delete</Text>
                </Pressable>
              </View>
            </PixelCard>
          ))
        )}
      </ScrollView>

      {/* New Entry Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>NEW JOURNAL ENTRY</Text>

            {/* Category picker */}
            <Text style={styles.modalFieldLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCatScroll}>
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <Pressable
                  key={c.id}
                  onPress={() => setCategory(c.id as JournalCategory)}
                  style={[
                    styles.modalCatChip,
                    category === c.id && styles.modalCatChipActive,
                  ]}
                >
                  <Text style={styles.catEmoji}>{c.emoji}</Text>
                  <Text style={[styles.catLabel, category === c.id && styles.catLabelActive]}>
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Title */}
            <Text style={styles.modalFieldLabel}>Title:</Text>
            <TextInput
              style={styles.modalInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Rainy cafe afternoon together..."
              placeholderTextColor={COLORS.textMuted}
            />

            {/* Content */}
            <Text style={styles.modalFieldLabel}>Story / Note:</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={5}
              placeholder="Write down the details, how she smiled, or what you want to plan..."
              placeholderTextColor={COLORS.textMuted}
            />

            {/* Action Buttons */}
            <View style={styles.modalActionRow}>
              <PixelButton
                title="CANCEL"
                onPress={() => setModalVisible(false)}
                variant="outline"
                size="md"
                style={{ flex: 1 }}
              />
              <PixelButton
                title="SAVE +10 XP 💖"
                onPress={handleCreateEntry}
                variant="accent"
                size="md"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categoryBar: {
    backgroundColor: '#FFF5EB',
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFE5D4',
    paddingVertical: 6,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
  },
  categoryChipActive: {
    backgroundColor: '#FFE3E8',
    borderColor: COLORS.accent,
  },
  catEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  catLabel: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  catLabelActive: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 10,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  entryCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryCategoryBadge: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  entryCategoryText: {
    fontFamily: FONTS.pixel,
    fontSize: 6,
    color: COLORS.accent,
  },
  entryDate: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
  },
  entryTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 10,
    color: COLORS.text,
    marginBottom: 4,
  },
  entryBody: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    lineHeight: 20,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FFF1F3',
    paddingTop: 6,
  },
  deleteText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(111, 78, 55, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFDF9',
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.pixelLg,
  },
  modalTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 11,
    color: COLORS.brownOutline,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  modalFieldLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.text,
    marginBottom: 4,
    marginTop: 6,
  },
  modalCatScroll: {
    marginBottom: 6,
  },
  modalCatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    marginRight: 6,
  },
  modalCatChipActive: {
    backgroundColor: '#FFE3E8',
    borderColor: COLORS.accent,
  },
  modalInput: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  modalTextarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: SPACING.lg,
  },
});
