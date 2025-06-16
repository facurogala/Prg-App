import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FormulaProvider } from '../contexts/FormulaProvider';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FormulaProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#111111',
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: '#DBFF00',
            tabBarInactiveTintColor: '#666',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Calculator',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calculator" size={size} color={color} />
              ),
            }}
          />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
        </Tabs>
      </FormulaProvider>
    </GestureHandlerRootView>
  );
}
