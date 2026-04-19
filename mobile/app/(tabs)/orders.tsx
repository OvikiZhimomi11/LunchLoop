import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/LunchloopUI';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const history = [
    { id: '1', name: 'Club Sandwich', date: '18 April, 01:20 PM', status: 'Completed', price: '85.00' },
    { id: '2', name: 'Quinoa Bowl', date: '17 April, 12:45 PM', status: 'Completed', price: '120.00' },
    { id: '3', name: 'Orange Juice', date: '17 April, 10:15 AM', status: 'Completed', price: '45.00' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {history.map((item) => (
          <Card key={item.id} style={styles.historyItem}>
            <View style={styles.leftInfo}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255, 51, 153, 0.05)' }]}>
                <Ionicons name="restaurant-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.itemDate, { color: colors.muted }]}>{item.date}</Text>
              </View>
            </View>
            <View style={styles.rightSide}>
              <Text style={[styles.itemPrice, { color: colors.text }]}>₹ {item.price}</Text>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(0, 209, 255, 0.1)' }]}>
                <Text style={[styles.statusText, { color: '#00D1FF' }]}>{item.status}</Text>
              </View>
            </View>
          </Card>
        ))}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    padding: 24,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemDate: {
    fontSize: 12,
    marginTop: 2,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
