import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].surface,
          borderTopWidth: 0,
          elevation: 0,
          height: 90,
          paddingBottom: 30,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? "home" : "home-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? "receipt" : "receipt-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? "person" : "person-outline"} color={color} />,
        }}
      />
    </Tabs>
  );
}
