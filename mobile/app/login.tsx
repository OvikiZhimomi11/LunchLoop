import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PrimaryButton, IconButton } from '@/components/LunchloopUI';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        alert(error.message);
        setLoading(false);
      } else {
        console.log('Login successful, session established');
        // We don't need to router.replace here because RootLayout will detect the session change
      }
    } catch (err: any) {
      console.error('Unexpected login error:', err);
      alert("An unexpected error occurred. Please check your connection.");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    // Basic Supabase Google Auth setup
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'lunchloop://google-auth',
      },
    });

    if (error) alert(error.message);
    // Note: Actual browser redirect handling requires more setup in app.json and root layout
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.smallLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Login to order your next meal.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Student Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="student@campus.edu"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <PrimaryButton 
            title={loading ? "Authenticating..." : "Login to Dashboard"} 
            onPress={handleLogin} 
            style={styles.loginBtn} 
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.line, { backgroundColor: 'rgba(255, 51, 153, 0.1)' }]} />
            <Text style={[styles.dividerText, { color: colors.muted }]}>OR</Text>
            <View style={[styles.line, { backgroundColor: 'rgba(255, 51, 153, 0.1)' }]} />
          </View>

          <TouchableOpacity style={[styles.googleBtn, { borderColor: 'rgba(255, 51, 153, 0.2)' }]} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={20} color={colors.primary} />
            <Text style={[styles.googleBtnText, { color: colors.text }]}>Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={[styles.forgotText, { color: colors.muted }]}>
              Forgot Password? <Text style={{ color: colors.primary, fontWeight: '700' }}>Reset here</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupLink} onPress={() => router.push('/signup')}>
            <Text style={[styles.signupLinkText, { color: colors.muted }]}>
              Don&apos;t have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Create one</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  smallLogo: {
    width: 60,
    height: 60,
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    padding: 18,
    borderRadius: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 153, 0.1)',
  },
  loginBtn: {
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    gap: 15,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  forgotBtn: {
    marginTop: 30,
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
  },
  signupLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupLinkText: {
    fontSize: 14,
  },
});
