/**
 * Baby — SettingsScreen Component
 * App settings: Girlfriend Profile, Pet Room Decor Unlocks,
 * Offline Notification Preferences, Achievements Gallery, and Data Management.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Switch, Alert, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Header from '../../components/common/Header';
import PixelCard from '../../components/cards/PixelCard';
import PixelButton from '../../components/buttons/PixelButton';
import ProgressBar from '../../components/common/ProgressBar';
import {
  useProfile, useSettings, useXP, usePet, useAchievements,
} from '../../hooks/useStorage';
import { SHOP_ITEMS } from '../../constants';
import * as Storage from '../../storage/storage';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen({ navigation }: any) {
  const { profile, save: saveProfile } = useProfile();
  const { settings, save: saveSettings, resetAllData } = useSettings();
  const { xp, addXP, deductXP } = useXP();
  const { pet, save: savePet } = usePet();
  const { achievements } = useAchievements();

  // Profile Form State
  const [name, setName] = useState(profile?.girlfriendName || '');
  const [cycleLength, setCycleLength] = useState(String(profile?.averageCycleLength || 28));
  const [periodLength, setPeriodLength] = useState(String(profile?.averagePeriodLength || 5));

  // Notification toggles
  const [notifEnabled, setNotifEnabled] = useState(settings.notifications.enabled);
  const [periodRemind, setPeriodRemind] = useState(settings.notifications.periodReminder);
  const [dailyRemind, setDailyRemind] = useState(settings.notifications.dailyLogReminder);
  const [waterRemind, setWaterRemind] = useState(settings.notifications.waterReminder);

  const handleSaveProfile = async () => {
    if (!profile) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await saveProfile({
      ...profile,
      girlfriendName: name.trim() || 'My Girlfriend',
      averageCycleLength: parseInt(cycleLength, 10) || 28,
      averagePeriodLength: parseInt(periodLength, 10) || 5,
    });

    Alert.alert('Profile Saved! 💕', 'Cycle calculations have been refreshed.');
  };

  const handleSaveNotifications = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await saveSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        enabled: notifEnabled,
        periodReminder: periodRemind,
        dailyLogReminder: dailyRemind,
        waterReminder: waterRemind,
      },
    });

    Alert.alert('Notifications Updated! 🔔', 'Local offline reminders updated.');
  };

  const handleBuyShopItem = async (item: typeof SHOP_ITEMS[0]) => {
    if (xp.totalXP < item.cost) {
      Alert.alert(
        'More Love XP Needed! 💖',
        `You need ${item.cost} Love XP to unlock ${item.name}. Keep completing daily missions and logging care to earn more!`
      );
      return;
    }

    await deductXP(item.cost);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Add to pet room decor
    const currentFurniture = pet.room.furniture || [];
    if (!currentFurniture.includes(item.id)) {
      await savePet({
        ...pet,
        room: {
          ...pet.room,
          furniture: [...currentFurniture, item.id],
        },
      });
    }

    Alert.alert('Unlocked! 🎉', `${item.name} unlocked for ${pet.name}'s room! Spent ${item.cost} Love XP.`);
  };

  const handleResetData = () => {
    Alert.alert(
      'Start Fresh (Reset Data)?',
      'This will erase all saved logs, memories, and progress from your device so you can start with a completely fresh, clean app. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Completely Fresh',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await resetAllData();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="SETTINGS & DECOR"
        subtitle="Manage cycle info, notifications, and pet decor"
        emoji="⚙️"
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Section 1: Girlfriend Profile */}
        <PixelCard>
          <Text style={styles.sectionTitle}>❤️ HER CYCLE PROFILE</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Her Name / Nickname:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Her name"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.fieldRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Avg Cycle Length:</Text>
              <TextInput
                style={styles.input}
                value={cycleLength}
                onChangeText={setCycleLength}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Avg Period Days:</Text>
              <TextInput
                style={styles.input}
                value={periodLength}
                onChangeText={setPeriodLength}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <PixelButton
            title="UPDATE HER PROFILE"
            onPress={handleSaveProfile}
            variant="primary"
            size="sm"
            style={{ marginTop: 8 }}
          />
        </PixelCard>

        {/* Section 2: Pet Cozy Room Shop (Spend Love XP) */}
        <PixelCard>
          <View style={styles.shopHeader}>
            <Text style={styles.sectionTitle}>🪴 PET ROOM UNLOCKS</Text>
            <Text style={styles.xpBalance}>Balance: {xp.totalXP} XP</Text>
          </View>
          <Text style={styles.subtitle}>
            Use your earned Love XP to decorate {pet.name}'s cozy room!
          </Text>

          <View style={styles.shopGrid}>
            {SHOP_ITEMS.slice(0, 6).map(item => {
              const isUnlocked = pet.room.furniture?.includes(item.id);
              return (
                <View key={item.id} style={[styles.shopItem, isUnlocked && styles.shopItemUnlocked]}>
                  <Text style={styles.shopEmoji}>{item.icon}</Text>
                  <Text style={styles.shopName}>{item.name}</Text>
                  <Text style={styles.shopCost}>{item.cost} XP</Text>
                  <PixelButton
                    title={isUnlocked ? 'OWNED ✔' : 'UNLOCK'}
                    onPress={() => handleBuyShopItem(item)}
                    variant={isUnlocked ? 'outline' : 'accent'}
                    size="sm"
                    disabled={isUnlocked}
                  />
                </View>
              );
            })}
          </View>
        </PixelCard>

        {/* Section 3: Offline Notifications */}
        <PixelCard>
          <Text style={styles.sectionTitle}>🔔 OFFLINE LOCAL REMINDERS</Text>
          <Text style={styles.subtitle}>
            All alarms run purely on your phone without internet or external servers:
          </Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Enable Local Notifications</Text>
              <Text style={styles.switchSub}>Offline push notifications</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ true: COLORS.accent, false: '#DDD' }}
            />
          </View>

          {notifEnabled && (
            <>
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Period Prediction Alert</Text>
                  <Text style={styles.switchSub}>"Cycle may start tomorrow"</Text>
                </View>
                <Switch
                  value={periodRemind}
                  onValueChange={setPeriodRemind}
                  trackColor={{ true: COLORS.accent, false: '#DDD' }}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Evening Care Check-in</Text>
                  <Text style={styles.switchSub}>"Don't forget today's mood"</Text>
                </View>
                <Switch
                  value={dailyRemind}
                  onValueChange={setDailyRemind}
                  trackColor={{ true: COLORS.accent, false: '#DDD' }}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Hydration Reminder</Text>
                  <Text style={styles.switchSub}>"Water reminder for both of you"</Text>
                </View>
                <Switch
                  value={waterRemind}
                  onValueChange={setWaterRemind}
                  trackColor={{ true: COLORS.accent, false: '#DDD' }}
                />
              </View>
            </>
          )}

          <PixelButton
            title="SAVE NOTIFICATION PREFERENCES"
            onPress={handleSaveNotifications}
            variant="secondary"
            size="sm"
            style={{ marginTop: 8 }}
          />
        </PixelCard>

        {/* Section 4: Achievements Gallery */}
        <PixelCard>
          <Text style={styles.sectionTitle}>🏆 PARTNER ACHIEVEMENTS</Text>
          <Text style={styles.subtitle}>Milestones in understanding and caring:</Text>

          <View style={styles.achieveList}>
            {achievements.map(ach => (
              <View key={ach.id} style={[styles.achieveRow, ach.unlocked && styles.achieveUnlocked]}>
                <Text style={styles.achieveEmoji}>{ach.icon}</Text>
                <View style={styles.achieveInfo}>
                  <Text style={styles.achieveTitle}>
                    {ach.title} {ach.unlocked ? '✔' : ''}
                  </Text>
                  <Text style={styles.achieveDesc}>{ach.description}</Text>
                  <ProgressBar
                    progress={Math.min(1, ach.progress / ach.requirement)}
                    height={8}
                    color={ach.unlocked ? COLORS.success : COLORS.accent}
                  />
                </View>
                <View style={styles.achieveXP}>
                  <Text style={styles.achieveXPText}>+{ach.xpReward} XP</Text>
                </View>
              </View>
            ))}
          </View>
        </PixelCard>

        {/* Section 5: Data Management & Privacy */}
        <PixelCard color="#FFF5F7">
          <Text style={styles.sectionTitle}>🔒 LOCAL STORAGE & PRIVACY</Text>
          <Text style={styles.privacyNotice}>
            Baby stores 100% of data locally in JSON via AsyncStorage on this device.
            No data ever leaves your phone.
          </Text>
          <PixelButton
            title="RESET ALL DATA ⚠️"
            onPress={handleResetData}
            variant="outline"
            size="sm"
            style={{ marginTop: 8 }}
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  sectionTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.brownOutline,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  field: {
    marginBottom: SPACING.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 8,
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
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpBalance: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.accent,
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shopItem: {
    width: '48%',
    backgroundColor: '#FFFDF9',
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    padding: 8,
    alignItems: 'center',
    ...SHADOWS.pixel,
  },
  shopItemUnlocked: {
    backgroundColor: '#F0F9F3',
    borderColor: COLORS.success,
  },
  shopEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  shopName: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  shopCost: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.accent,
    marginBottom: 6,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF1F3',
  },
  switchLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.text,
  },
  switchSub: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginTop: 2,
  },
  achieveList: {
    gap: 8,
  },
  achieveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    padding: 8,
    ...SHADOWS.pixel,
  },
  achieveUnlocked: {
    backgroundColor: '#F3FFF7',
    borderColor: COLORS.success,
  },
  achieveEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  achieveInfo: {
    flex: 1,
  },
  achieveTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.text,
  },
  achieveDesc: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  achieveXP: {
    backgroundColor: '#FFE3E8',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginLeft: 6,
  },
  achieveXPText: {
    fontFamily: FONTS.pixel,
    fontSize: 6,
    color: COLORS.accent,
  },
  privacyNotice: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    lineHeight: 20,
  },
});
