/**
 * Baby — MemoriesScreen Component
 * Never forget her favorites: chocolate, flowers, coffee order, sizes, important dates, etc.
 * All fields are editable and stored locally.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Header from '../../components/common/Header';
import PixelCard from '../../components/cards/PixelCard';
import PixelButton from '../../components/buttons/PixelButton';
import { useMemories, useXP } from '../../hooks/useStorage';
import { Memories } from '../../types';
import * as Haptics from 'expo-haptics';

export default function MemoriesScreen({ navigation }: any) {
  const { memories, save } = useMemories();
  const { addXP } = useXP();
  const [formData, setFormData] = useState<Memories>(memories);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setFormData(memories);
  }, [memories]);

  const updateField = (field: keyof Memories, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await save(formData);
    setIsEditing(false);
    await addXP(15);

    Alert.alert('Saved with Love! 💖', 'All her favorite details updated locally.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="HER FAVORITES & DATES"
        subtitle="Keep every little detail close to heart"
        emoji="💎"
        rightElement={
          <PixelButton
            title={isEditing ? 'CANCEL' : 'EDIT ✏️'}
            onPress={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'outline' : 'secondary'}
            size="sm"
          />
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Shortcut to Relationship Journal */}
        <PixelCard style={styles.journalBanner} color="#FFF0F5">
          <View style={styles.bannerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>📖 RELATIONSHIP JOURNAL</Text>
              <Text style={styles.bannerSub}>
                Daily notes, special moments, date ideas & future plans
              </Text>
            </View>
            <PixelButton
              title="OPEN ➔"
              onPress={() => navigation.navigate('Journal')}
              variant="accent"
              size="sm"
            />
          </View>
        </PixelCard>

        {/* Section 1: Treats & Drinks */}
        <PixelCard>
          <Text style={styles.sectionHeader}>🍫 SWEET TREATS & DRINKS</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Favorite Chocolate:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.favoriteChocolate}
              onChangeText={txt => updateField('favoriteChocolate', txt)}
              placeholder="e.g. Lindt Sea Salt Dark Chocolate"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Coffee Order:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.coffeeOrder}
              onChangeText={txt => updateField('coffeeOrder', txt)}
              placeholder="e.g. Iced Oat Milk Vanilla Latte, 1 pump vanilla"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Favorite Drink:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.favoriteDrink}
              onChangeText={txt => updateField('favoriteDrink', txt)}
              placeholder="e.g. Strawberry Matcha, Peach Iced Tea"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Favorite Food & Snacks:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.favoriteFood}
              onChangeText={txt => updateField('favoriteFood', txt)}
              placeholder="e.g. Ramen, Gyoza, Spicy Salmon Sushi"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </PixelCard>

        {/* Section 2: Flowers & Aesthetics */}
        <PixelCard>
          <Text style={styles.sectionHeader}>🌸 FLOWERS & FAVORITES</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Favorite Flowers:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.favoriteFlowers}
              onChangeText={txt => updateField('favoriteFlowers', txt)}
              placeholder="e.g. White Peonies, Baby's Breath, Pink Tulips"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Favorite Color:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.favoriteColor}
              onChangeText={txt => updateField('favoriteColor', txt)}
              placeholder="e.g. Sage Green, Lavender, Pastel Pink"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Love Language:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.loveLanguage}
              onChangeText={txt => updateField('loveLanguage', txt)}
              placeholder="e.g. Physical Touch, Quality Time, Words of Affirmation"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </PixelCard>

        {/* Section 3: Important Dates & Anniversaries */}
        <PixelCard>
          <Text style={styles.sectionHeader}>📅 IMPORTANT DATES</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Birthday:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.birthday}
              onChangeText={txt => updateField('birthday', txt)}
              placeholder="e.g. October 14"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Anniversary:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.anniversary}
              onChangeText={txt => updateField('anniversary', txt)}
              placeholder="e.g. June 22"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>First Date / When You Met:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.firstDate}
              onChangeText={txt => updateField('firstDate', txt)}
              placeholder="e.g. Cafe Baby on a rainy Tuesday"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </PixelCard>

        {/* Section 4: Sizes (for thoughtful gifts & clothes) */}
        <PixelCard>
          <Text style={styles.sectionHeader}>🎁 GIFTING SIZES</Text>

          <View style={styles.sizeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Ring Size:</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                editable={isEditing}
                value={formData.ringSize}
                onChangeText={txt => updateField('ringSize', txt)}
                placeholder="e.g. 6"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Clothing Size:</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                editable={isEditing}
                value={formData.clothingSize}
                onChangeText={txt => updateField('clothingSize', txt)}
                placeholder="e.g. S / M"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Shoe Size:</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                editable={isEditing}
                value={formData.shoeSize}
                onChangeText={txt => updateField('shoeSize', txt)}
                placeholder="e.g. 7 US"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>
        </PixelCard>

        {/* Section 5: Entertainment & Dream Places */}
        <PixelCard>
          <Text style={styles.sectionHeader}>🎬 MEDIA & DREAM DATES</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Favorite Movies / Shows:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.favoriteMovies?.join(', ') || ''}
              onChangeText={txt => updateField('favoriteMovies', txt.split(',').map(s => s.trim()))}
              placeholder="e.g. Howl's Moving Castle, Gilmore Girls"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Favorite Anime:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.favoriteAnime?.join(', ') || ''}
              onChangeText={txt => updateField('favoriteAnime', txt.split(',').map(s => s.trim()))}
              placeholder="e.g. Frieren, Spy x Family, Kimi ni Todoke"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Dream Places to Visit Together:</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              editable={isEditing}
              value={formData.dreamPlaces?.join(', ') || ''}
              onChangeText={txt => updateField('dreamPlaces', txt.split(',').map(s => s.trim()))}
              placeholder="e.g. Kyoto in autumn, Swiss Alps, cozy cabin"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </PixelCard>

        {/* Save button if editing */}
        {isEditing && (
          <PixelButton
            title="SAVE HER FAVORITES 💕"
            onPress={handleSave}
            variant="accent"
            size="lg"
            style={{ marginBottom: SPACING.md }}
          />
        )}
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
  journalBanner: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.accent,
  },
  bannerSub: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginTop: 2,
  },
  sectionHeader: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.brownOutline,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5EC',
    paddingBottom: 4,
  },
  field: {
    marginBottom: SPACING.sm,
  },
  label: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  inputDisabled: {
    backgroundColor: '#FAF5EE',
    borderColor: '#E8D8CA',
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
