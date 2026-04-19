import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card, IconButton, PrimaryButton } from '@/components/LunchloopUI';
import { Ionicons } from '@expo/vector-icons';

import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { profile, loading } = useProfile();

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/');
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.muted }}>Loading profile...</Text>
      </View>
    );
  }

  const initials = (profile?.name || 'Student').substring(0, 2).toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
        <IconButton icon="settings-outline" onPress={() => {}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Digital Card Section */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.surface }]}>
                <Ionicons name="camera" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.mainInfo}>
              <Text style={[styles.studentName, { color: colors.text }]}>{profile?.name || 'Student Name'}</Text>
              <Text style={[styles.studentId, { color: colors.muted }]}>{profile?.student_id || 'ID: XXXX-XXXX'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>School</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{profile?.school_college || 'School Name'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Class</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{profile?.class_section || 'Grade X'}</Text>
            </View>
          </View>
        </Card>

        {/* Wallet Info Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Wallet Overview</Text>
        <View style={styles.walletGrid}>
          <Card style={styles.walletStat}>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Balance</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>₹ {(profile?.wallet_balance ?? 0).toFixed(2)}</Text>
          </Card>
          <Card style={styles.walletStat}>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Total Spent</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>₹ 0.00</Text>
          </Card>
        </View>

        {/* Actions Section */}
        <Card style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionRow}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 51, 153, 0.05)' }]}>
              <Ionicons name="card-outline" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionRow}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(0, 209, 255, 0.05)' }]}>
              <Ionicons name="notifications-outline" size={22} color="#00D1FF" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
        </Card>

        <TouchableOpacity 
          style={[styles.logoutBtn, { borderColor: 'rgba(255, 51, 153, 0.2)' }]} 
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: colors.primary }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    padding: 24,
  },
  profileCard: {
    padding: 24,
    marginBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
  },
  editBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF', // Should follow theme
  },
  mainInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  studentId: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 20,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  walletGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  walletStat: {
    flex: 1,
    padding: 20,
    marginBottom: 0,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  actionsCard: {
    padding: 8,
    marginBottom: 30,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 16,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  logoutBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
