import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, Card } from '@/components/LunchloopUI';

import { supabase } from '@/lib/supabase';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { id: mealId, name, price } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const orderId = React.useMemo(() => `#ORD-${Math.floor(Math.random() * 9000) + 1000}`, []);
  const numericPrice = parseFloat(typeof price === 'string' ? price : '0') || 0;
  
  const [loading, setLoading] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);
  const [remainingBalance, setRemainingBalance] = React.useState(0);

  async function handleConfirm() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // 1. Get current balance
      const { data: userData } = await supabase.from('users').select('wallet_balance').eq('id', user.id).single();
      const currentBalance = userData?.wallet_balance || 0;

      if (currentBalance < numericPrice) {
        alert("Insufficient balance!");
        return;
      }

      const newBalance = currentBalance - numericPrice;

      // 2. Insert Order
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        meal_id: mealId as string,
        total_price: numericPrice,
        status: 'completed'
      });

      if (orderError) throw orderError;

      // 3. Update Balance
      const { error: balanceError } = await supabase.from('users').update({
        wallet_balance: newBalance
      }).eq('id', user.id);

      if (balanceError) throw balanceError;

      setRemainingBalance(newBalance);
      setConfirmed(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.successIcon, { backgroundColor: confirmed ? colors.success : colors.primary }]}>
          <Ionicons name={confirmed ? "checkmark" : "cart"} size={48} color="#FFF" />
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>
          {confirmed ? "Order Confirmed!" : "Confirm Order"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {confirmed ? "Your meal will be ready in 15 mins." : "Review your order details below."}
        </Text>

        <Card style={styles.detailsCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Order Details</Text>
          
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.muted }]}>Meal</Text>
            <Text style={[styles.rowValue, { color: colors.text }]}>{name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.muted }]}>Order ID</Text>
            <Text style={[styles.rowValue, { color: colors.text }]}>{orderId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.muted }]}>Total Paid</Text>
            <Text style={[styles.rowValue, { color: colors.text }]}>₹ {numericPrice.toFixed(2)}</Text>
          </View>

          {confirmed && (
            <View style={[styles.row, styles.totalRow]}>
              <Text style={[styles.rowLabel, { color: colors.muted }]}>Remaining Balance</Text>
              <Text style={[styles.rowValue, { color: colors.success, fontWeight: '700' }]}>₹ {remainingBalance.toFixed(2)}</Text>
            </View>
          )}
        </Card>

        {confirmed ? (
          <PrimaryButton 
            title="Back to Home" 
            onPress={() => router.replace('/(tabs)')} 
            style={styles.homeBtn}
          />
        ) : (
          <View style={{ width: '100%', gap: 12 }}>
            <PrimaryButton 
              title={loading ? "Processing..." : `Pay ₹ ${numericPrice.toFixed(2)}`}
              onPress={handleConfirm} 
              style={styles.homeBtn}
            />
            <TouchableOpacity onPress={() => router.back()} style={{ alignItems: 'center', padding: 10 }}>
              <Text style={{ color: colors.muted, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 30,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#FF3399',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  detailsCard: {
    width: '100%',
    padding: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 51, 153, 0.05)',
  },
  rowLabel: {
    fontSize: 14,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 51, 153, 0.2)',
  },
  homeBtn: {
    marginTop: 40,
  },
});
