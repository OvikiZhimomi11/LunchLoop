import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  
  const [session, setSession] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Wait for auth and navigation to be ready
    if (!initialized || !navigationState?.key) return;

    const inTabsGroup = segments[0] === '(tabs)';

    // Perform redirection logic
    if (session && !inTabsGroup) {
      router.replace('/(tabs)');
    } else if (!session && inTabsGroup) {
      router.replace('/');
    }

    // ALWAYS hide the splash screen once we are initialized and ready
    // We use a small delay to ensure the first frame of the screen is rendered
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);

    return () => clearTimeout(timer);
  }, [session, initialized, segments, navigationState?.key]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="menu-preview" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="confirmation" options={{ presentation: 'modal' }} />
        <Stack.Screen name="meal-selection" options={{ headerShown: true, title: "Order Meal" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
