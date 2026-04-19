import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MealCard, PrimaryButton, IconButton } from '@/components/LunchloopUI';

export default function MenuPreviewScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Today&apos;s Menu</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today&apos;s Special</Text>
        </View>
        
        <View style={styles.disabledCard}>
          <MealCard 
            name="Quinoa Bowl"
            price="120.00"
            description="Mediterranean bowl with grains"
            image={require('@/assets/images/meal_bowl.png')}
            onOrder={() => {}}
          />
        </View>

        <View style={styles.disabledCard}>
          <MealCard 
            name="Club Sandwich"
            price="85.00"
            description="Toasted with herb mayo"
            image={require('@/assets/images/meal_sandwich.png')}
            onOrder={() => {}}
          />
        </View>

        <View style={styles.disabledCard}>
          <MealCard 
            name="Orange Juice"
            price="45.00"
            description="100% cold pressed"
            image={require('@/assets/images/meal_bowl.png')}
            onOrder={() => {}}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.footerText, { color: colors.muted }]}>Want to order? Please login first.</Text>
        <PrimaryButton 
          title="Login to Order" 
          onPress={() => router.push('/login')} 
        />
      </View>
    </View>
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 24,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  disabledCard: {
    opacity: 0.8,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
});
