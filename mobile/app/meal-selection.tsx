import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MealCard } from '@/components/LunchloopUI';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';

export default function MealSelectionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [meals, setMeals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchMeals() {
      const { data, error } = await supabase.from('meals').select('*');
      if (data) setMeals(data);
      setLoading(false);
    }
    fetchMeals();
  }, []);

  const handleOrder = (id: string, name: string, price: string) => {
    router.push({
      pathname: '/confirmation',
      params: { id, name, price }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ 
        headerTitle: "Today's Menu", 
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
      }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Main Courses</Text>
        
        {loading ? (
          <Text style={{ color: colors.muted }}>Loading menu...</Text>
        ) : (
          meals.map((meal) => (
            <MealCard 
              key={meal.id}
              name={meal.name}
              price={meal.price.toFixed(2)}
              description={meal.description}
              image={require('@/assets/images/meal_bowl.png')}
              onOrder={() => handleOrder(meal.id, meal.name, meal.price.toString())}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
});
