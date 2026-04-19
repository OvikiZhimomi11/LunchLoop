import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WalletCard, Card, MealCard, IconButton } from '@/components/LunchloopUI';
import { Ionicons } from '@expo/vector-icons';

import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { profile, loading: profileLoading } = useProfile();
  const [specialMeal, setSpecialMeal] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchSpecial() {
      const { data } = await supabase.from('meals').select('*').limit(1).single();
      if (data) setSpecialMeal(data);
    }
    fetchSpecial();
  }, []);

  if (profileLoading) return null; // Or a skeleton

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.muted }]}>Hello,</Text>
          <Text style={[styles.userName, { color: colors.text }]}>{profile?.name || 'Student'}</Text>
        </View>
        <IconButton icon="notifications-outline" onPress={() => {}} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Wallet Section */}
        <WalletCard 
          balance={profile?.wallet_balance?.toFixed(2) || "0.00"} 
          cardId={profile?.student_id || "LL-XXXX-XXXX"} 
          onRecharge={() => alert('Recharge coming soon!')} 
        />

        {/* Today's Special Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today&apos;s Special</Text>
          <TouchableOpacity onPress={() => router.push('/meal-selection')}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View Menu</Text>
          </TouchableOpacity>
        </View>

        {specialMeal ? (
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/meal-selection')}>
            <Card style={styles.specialCard}>
              <View style={styles.specialBadge}>
                <Text style={styles.specialBadgeText}>Chef&apos;s Choice</Text>
              </View>
              <MealCard 
                name={specialMeal.name}
                price={specialMeal.price.toFixed(2)}
                description={specialMeal.description || "Fresh and healthy"}
                image={require('@/assets/images/meal_bowl.png')}
                onOrder={() => router.push({ pathname: '/confirmation', params: { name: specialMeal.name, price: specialMeal.price.toString() } })}
              />
            </Card>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: colors.muted }}>Loading special meal...</Text>
        )}

        {/* Quick Actions Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/orders')}>
            <Card style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,51,153,0.1)' }]}>
                <Ionicons name="receipt-outline" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>History</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/explore')}>
            <Card style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(0,209,255,0.1)' }]}>
                <Ionicons name="person-outline" size={24} color="#00D1FF" />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Profile</Text>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
  },
  specialCard: {
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  specialBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF3399',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
    zIndex: 1,
  },
  specialBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionItem: {
    flex: 1,
  },
  actionCard: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
});
