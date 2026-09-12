/**
 * Baby — Navigation Types
 */

export type RootTabParamList = {
  Home: undefined;
  Calendar: undefined;
  Tracker: { date?: string } | undefined;
  Analytics: undefined;
  Memories: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Journal: undefined;
};
