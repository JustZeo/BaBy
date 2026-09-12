/**
 * Baby — TrackerScreen Component
 * Complete cycle, mood, symptom, flow, and health logging.
 * Saves locally to AsyncStorage and awards Love XP.
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
import MoodSelector from '../../components/tracker/MoodSelector';
import SymptomSelector from '../../components/tracker/SymptomSelector';
import FlowSelector from '../../components/tracker/FlowSelector';
import HealthInputs from '../../components/tracker/HealthInputs';
import { useProfile, useDailyLogs, useXP, useCycleData } from '../../hooks/useStorage';
import { DailyLog, FlowLevel, MoodType, SymptomType, HealthLog } from '../../types';
import { format, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';

export default function TrackerScreen({ route, navigation }: any) {
  const targetDateStr = route.params?.date || format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState<string>(targetDateStr);

  const { profile, save: saveProfile } = useProfile();
  const { logs, saveLog } = useDailyLogs();
  const { addXP, recordCare } = useXP();
  const { addRecord } = useCycleData();

  // Form State
  const [isPeriod, setIsPeriod] = useState<boolean>(false);
  const [flow, setFlow] = useState<FlowLevel | undefined>(undefined);
  const [moods, setMoods] = useState<MoodType[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomType[]>([]);
  const [health, setHealth] = useState<HealthLog>({
    waterIntake: 0,
    sleepHours: 7,
    exercise: false,
    vitamin: false,
  });
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [medication, setMedication] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Load existing log for selected date
  useEffect(() => {
    const existing = logs[selectedDate];
    if (existing) {
      setIsPeriod(!!existing.isPeriod);
      setFlow(existing.flow);
      setMoods(existing.moods || []);
      setSymptoms(existing.symptoms || []);
      setHealth(existing.health || {
        waterIntake: 0,
        sleepHours: 7,
        exercise: false,
        vitamin: false,
      });
      setTemperature(existing.temperature);
      setMedication(existing.medication || '');
      setNotes(existing.notes || '');
    } else {
      // Reset for new entry
      setIsPeriod(false);
      setFlow(undefined);
      setMoods([]);
      setSymptoms([]);
      setHealth({ waterIntake: 0, sleepHours: 7, exercise: false, vitamin: false });
      setTemperature(undefined);
      setMedication('');
      setNotes('');
    }
  }, [selectedDate, logs]);

  // Update selected date if route param changes
  useEffect(() => {
    if (route.params?.date) {
      setSelectedDate(route.params.date);
    }
  }, [route.params?.date]);

  const toggleMood = (mood: MoodType) => {
    setMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const toggleSymptom = (symptom: SymptomType) => {
    setSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const logData: DailyLog = {
      date: selectedDate,
      isPeriod,
      flow,
      moods,
      symptoms,
      health: {
        ...health,
        medication,
      },
      notes,
      medication,
      temperature,
    };

    await saveLog(selectedDate, logData);

    // Calculate XP earned
    let earnedXP = 0;
    if (moods.length > 0) earnedXP += 10;
    if (symptoms.length > 0) earnedXP += 15;
    if (isPeriod) earnedXP += 25;
    if (notes.trim().length > 0) earnedXP += 10;
    if (health.waterIntake > 0 || health.sleepHours > 0 || health.exercise || health.vitamin) earnedXP += 5;
    if (earnedXP === 0) earnedXP = 10; // Minimum care bonus for logging

    await saveLog(selectedDate, logData, earnedXP);

    setSavedMessage(`✔ Care Log Saved! +${earnedXP} Love XP Earned 💖`);
    setTimeout(() => setSavedMessage(null), 4500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="CYCLE & CARE TRACKER"
        subtitle={`Logging for ${format(parseISO(selectedDate), 'MMMM d, yyyy')}`}
        emoji="📝"
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Date Display Pill */}
        <View style={styles.dateSelectorRow}>
          <Text style={styles.datePill}>📅 {selectedDate}</Text>
          <Text style={styles.dateHint}>Everything stays 100% offline & private</Text>
        </View>

        {/* Period Toggle Card */}
        <PixelCard style={styles.periodCard} color={isPeriod ? '#FFE8EC' : '#FFFDF9'}>
          <View style={styles.periodRow}>
            <View>
              <Text style={styles.periodTitle}>IS HER PERIOD ACTIVE TODAY?</Text>
              <Text style={styles.periodSub}>Tap to toggle period status</Text>
            </View>
            <PixelButton
              title={isPeriod ? 'PERIOD ON 🩸' : 'NOT ON PERIOD'}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsPeriod(!isPeriod);
              }}
              variant={isPeriod ? 'accent' : 'outline'}
              size="sm"
            />
          </View>
        </PixelCard>

        {/* Flow Selector (if period is active or spotting) */}
        <PixelCard>
          <FlowSelector selectedFlow={flow} onSelectFlow={setFlow} />
        </PixelCard>

        {/* Mood Tracker */}
        <PixelCard>
          <MoodSelector selectedMoods={moods} onToggleMood={toggleMood} />
        </PixelCard>

        {/* Symptoms Tracker */}
        <PixelCard>
          <SymptomSelector selectedSymptoms={symptoms} onToggleSymptom={toggleSymptom} />
        </PixelCard>

        {/* Health Tracker (Water, Sleep, Temp, Meds, Vitamin) */}
        <PixelCard>
          <HealthInputs
            health={health}
            onChange={setHealth}
            temperature={temperature}
            onTemperatureChange={setTemperature}
          />
        </PixelCard>

        {/* Daily Partner Notes */}
        <PixelCard>
          <Text style={styles.sectionTitle}>PARTNER CARE NOTES</Text>
          <Text style={styles.subtitle}>
            What she shared, cravings, little sweet moments, or comfort reminders:
          </Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholder="e.g. She loved the ginger tea today, had a mild headache around 3pm, wanted to watch Studio Ghibli..."
            placeholderTextColor={COLORS.textMuted}
          />
        </PixelCard>

        {/* Visual Confirmation Toast */}
        {savedMessage && (
          <View style={styles.savedBanner}>
            <Text style={styles.savedBannerText}>{savedMessage}</Text>
          </View>
        )}

        {/* Save Button */}
        <PixelButton
          title="SAVE CARE LOG & EARN LOVE XP 💖"
          onPress={handleSave}
          variant="accent"
          size="lg"
          style={styles.saveBtn}
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
  dateSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  datePill: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.accent,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
  },
  dateHint: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  periodCard: {
    padding: SPACING.md,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.text,
  },
  periodSub: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 10,
    color: COLORS.brownOutline,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#FFFDF9',
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: SPACING.sm,
  },
  savedBanner: {
    backgroundColor: '#E8F8F0',
    borderWidth: 2,
    borderColor: COLORS.success,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.pixel,
  },
  savedBannerText: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: '#2E7D32',
    textAlign: 'center',
  },
});
