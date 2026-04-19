import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'lunchloop://google-auth',
        },
      });
      if (error) throw error;
    } catch (err: any) {
      alert("Google Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>Lunchloop</Text>
          <Text style={[styles.tagline, { color: colors.muted }]}>Campus Dining, Simplified.</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.googleBtn, { backgroundColor: colors.primary }]} 
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={20} color="#FFF" />
            <Text style={styles.googleBtnText}>
              {loading ? "Connecting..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={[styles.linkText, { color: colors.muted }]}>Manual Signup</Text>
            </TouchableOpacity>
            <View style={[styles.dot, { backgroundColor: colors.muted }]} />
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.linkText, { color: colors.muted }]}>Existing User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 100,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.8,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  googleBtn: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FF3399',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  googleBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
});
