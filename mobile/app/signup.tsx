import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PrimaryButton, IconButton } from '@/components/LunchloopUI';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [form, setForm] = useState({
    name: '',
    school: '',
    course: '',
    classSection: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!form.email || !form.password || !form.name || !form.school || !form.course) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      // Generate Student ID based on School, Course, and Class
      const getInitials = (str: string) => str.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3);
      const sch = getInitials(form.school);
      const crs = getInitials(form.course);
      const cls = form.classSection.replace(/\s+/g, '').toUpperCase().substring(0, 3);
      const random = Math.floor(Math.random() * 9000) + 1000;
      const generatedId = `LL-${sch}-${crs}-${cls}-${random}`;

      console.log('Attempting signup for:', form.email);
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            student_id: generatedId,
            school_college: form.school,
            course: form.course,
            class_section: form.classSection,
            wallet_balance: 0,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        alert(error.message);
        setLoading(false);
      } else {
        console.log('Signup successful');
        alert(`Account created! Your ID is: ${generatedId}. Please login.`);
        router.replace('/login');
      }
    } catch (err: any) {
      console.error('Unexpected signup error:', err);
      alert("An error occurred during signup. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    try {
      setLoading(true);
      console.log('Initiating Google OAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // This deep link must be registered in your Supabase Auth Dashboard
          redirectTo: 'lunchloop://google-auth', 
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;
      
      // Note: On mobile, this will open the system browser.
      // After the user signs in, they will be redirected back to the app.
      // RootLayout will detect the new session and move them to (tabs).
    } catch (err: any) {
      console.error('Google Auth Error:', err.message);
      alert("Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Account</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.smallLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="Aryan Sharma"
              placeholderTextColor="#999"
              value={form.name}
              onChangeText={(t) => setForm({...form, name: t})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>School / Institute Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="St. Xavier's High School"
              placeholderTextColor="#999"
              value={form.school}
              onChangeText={(t) => setForm({...form, school: t})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Course Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="Computer Science"
              placeholderTextColor="#999"
              value={form.course}
              onChangeText={(t) => setForm({...form, course: t})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Class / Section</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="Grade 12-B"
              placeholderTextColor="#999"
              value={form.classSection}
              onChangeText={(t) => setForm({...form, classSection: t})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="student@campus.edu"
              placeholderTextColor="#999"
              value={form.email}
              onChangeText={(t) => setForm({...form, email: t})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Create Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={form.password}
              onChangeText={(t) => setForm({...form, password: t})}
              secureTextEntry
            />
          </View>

          <PrimaryButton 
            title={loading ? "Creating Account..." : "Sign Up Now"} 
            onPress={handleSignup} 
            style={styles.signupBtn} 
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.line, { backgroundColor: 'rgba(255, 51, 153, 0.1)' }]} />
            <Text style={[styles.dividerText, { color: colors.muted }]}>OR</Text>
            <View style={[styles.line, { backgroundColor: 'rgba(255, 51, 153, 0.1)' }]} />
          </View>

          <TouchableOpacity style={[styles.googleBtn, { borderColor: 'rgba(255, 51, 153, 0.2)' }]} onPress={handleGoogleSignup}>
            <Ionicons name="logo-google" size={20} color={colors.primary} />
            <Text style={[styles.googleBtnText, { color: colors.text }]}>Sign up with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
            <Text style={[styles.loginLinkText, { color: colors.muted }]}>
              Already have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 30,
    paddingTop: 10,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  smallLogo: {
    width: 60,
    height: 60,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 18,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 153, 0.1)',
  },
  signupBtn: {
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  loginLink: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  loginLinkText: {
    fontSize: 14,
  },
});
