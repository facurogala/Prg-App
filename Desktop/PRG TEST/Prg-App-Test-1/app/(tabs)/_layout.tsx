import { Tabs } from 'expo-router';
import { Dumbbell, Settings, History, Timer } from 'lucide-react-native';
import { FormulaContext } from '../../contexts/FormulaContext';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  const [selectedFormulas, setSelectedFormulas] = useState<string[]>([
    'lander', 'oconner', 'lombardi', 'mayhem', 'wathen', 'brzycki', 'epley'
  ]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FormulaContext.Provider value={{ selectedFormulas, setSelectedFormulas }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#111111',
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: '#DBFF00',
            tabBarInactiveTintColor: '#666',
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Calculator',
              tabBarIcon: ({ size, color }) => (
                <Dumbbell size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              title: 'History',
              tabBarIcon: ({ size, color }) => (
                <History size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="timer"
            options={{
              title: 'Timer',
              tabBarIcon: ({ size, color }) => (
                <Timer size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ size, color }) => (
                <Settings size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </FormulaContext.Provider>
    </GestureHandlerRootView>
  );
}