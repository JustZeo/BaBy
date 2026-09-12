/**
 * Baby — App Entry Point
 * A cozy pixel-art relationship app for supportive boyfriends.
 * 100% Offline, Local JSON Storage, Zero Analytics Trackers, Zero Cloud.
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import AppNavigator from './src/src/navigation/AppNavigator';
import { BabyProvider, useBaby } from './src/src/context/BabyContext';
import { COLORS, FONTS } from './src/src/constants/theme';

function AppContent() {
  const { isOnboarded, saveProfile, loading } = useBaby();

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingEmoji}>🌙</Text>
        <Text style={styles.loadingTitle}>Baby</Text>
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 12 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppNavigator
        initialIsOnboarded={isOnboarded}
        onOnboardingComplete={saveProfile}
      />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PressStart2P: PressStart2P_400Regular,
    VT323: VT323_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingEmoji}>🌙</Text>
        <Text style={styles.loadingTitle}>Baby</Text>
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 12 }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <BabyProvider>
        <AppContent />
      </BabyProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  loadingTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 12,
    color: COLORS.brownOutline,
    letterSpacing: 1,
  },
});
