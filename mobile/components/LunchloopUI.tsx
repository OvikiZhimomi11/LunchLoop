import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ViewStyle, TextStyle, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export function Card({ children, style }: { children: React.ReactNode, style?: ViewStyle }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, style]}>
      {children}
    </View>
  );
}

export function IconButton({ icon, onPress, style, color }: { icon: any, onPress: () => void, style?: ViewStyle, color?: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface }, style]} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color={color || colors.primary} />
    </TouchableOpacity>
  );
}

export function PrimaryButton({ title, onPress, style }: { title: string, onPress: () => void, style?: ViewStyle }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.primary }, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function WalletCard({ balance, cardId, onRecharge }: { balance: string, cardId: string, onRecharge: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.walletCard}>
      <Text style={styles.walletLabel}>Prepaid Balance</Text>
      <Text style={styles.walletBalance}>₹ {balance}</Text>
      <Text style={styles.cardId}>CARD ID: {cardId}</Text>
      <TouchableOpacity style={[styles.rechargeBtn, { backgroundColor: colors.primary }]} onPress={onRecharge}>
        <Text style={styles.rechargeText}>Recharge</Text>
      </TouchableOpacity>
    </View>
  );
}

export function MealCard({ name, price, description, image, onOrder }: { name: string, price: string, description: string, image: any, onOrder: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Card style={styles.mealCard}>
      <View style={styles.mealImgWrapper}>
        <Image source={image} style={styles.mealImg} />
      </View>
      <View style={styles.mealInfo}>
        <Text style={[styles.mealName, { color: colors.text }]}>{name}</Text>
        <Text style={styles.mealDesc}>{description}</Text>
        <Text style={[styles.mealPrice, { color: colors.primary }]}>₹ {price}</Text>
      </View>
      <TouchableOpacity style={[styles.selectBtn, { backgroundColor: colors.primary }]} onPress={onOrder}>
        <Text style={styles.selectBtnText}>Select</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 20,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  btnPrimary: {
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#FF3399',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  walletCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 153, 0.2)',
  },
  walletLabel: {
    color: '#FFF',
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 4,
  },
  walletBalance: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardId: {
    color: '#FFF',
    opacity: 0.6,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  rechargeBtn: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  rechargeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealImgWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 51, 153, 0.05)',
  },
  mealImg: {
    width: '100%',
    height: '100%',
  },
  mealInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealDesc: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  selectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  selectBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
