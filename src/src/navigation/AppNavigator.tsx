/**
 * Baby — AppNavigator Component
 * Bottom tab bar with cozy pixel art icons and stack container for Onboarding / Journal.
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootTabParamList, RootStackParamList } from './types';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import TrackerScreen from '../screens/Tracker/TrackerScreen';
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import MemoriesScreen from '../screens/Memories/MemoriesScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import JournalScreen from '../screens/Journal/JournalScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={[
              styles.tabLabel,
              { color },
              focused && styles.tabLabelActive,
            ]}
          >
            {route.name}
          </Text>
        ),
        tabBarIcon: ({ focused }) => {
          let icon = '🌸';
          switch (route.name) {
            case 'Home':
              icon = focused ? '🏠' : '🏡';
              break;
            case 'Calendar':
              icon = '📅';
              break;
            case 'Tracker':
              icon = focused ? '💖' : '📝';
              break;
            case 'Analytics':
              icon = '📊';
              break;
            case 'Memories':
              icon = '💎';
              break;
            case 'Settings':
              icon = '⚙️';
              break;
          }
          return (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Text style={styles.tabIcon}>{icon}</Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Tracker" component={TrackerScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Memories" component={MemoriesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

interface AppNavigatorProps {
  initialIsOnboarded: boolean;
  onOnboardingComplete: (profile: any) => void;
}

export default function AppNavigator({
  initialIsOnboarded,
  onOnboardingComplete,
}: AppNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!initialIsOnboarded ? (
        <Stack.Screen name="Onboarding">
          {props => (
            <OnboardingScreen
              {...props}
              onComplete={profile => {
                onOnboardingComplete(profile);
              }}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="Journal"
            component={JournalScreen}
            options={{ presentation: 'card' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFDF9',
    borderTopWidth: 2,
    borderTopColor: COLORS.brownOutline,
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 8,
  },
  tabLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderRadius: 6,
  },
  iconActive: {
    backgroundColor: '#FFE3E8',
  },
  tabIcon: {
    fontSize: 18,
  },
});
