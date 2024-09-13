// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { HomeScreen, ProfileScreen, ChartScreen, PercentageScreen, SettingsScreen } from './Screens';
import { GlobalProvider } from './GlobalContext'; // Importa el GlobalProvider
import HomeIcon from './assets/Home.svg';
import PercentageIcon from './assets/Percentage.svg';
import ChartIcon from './assets/Chart.svg';
import ProfileIcon from './assets/Profile.svg';

// Define los navegadores de pestañas y de pila
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegador de pestañas
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: {
        backgroundColor: '#0D1520',
        borderTopWidth: 0,
        borderTopColor: 'transparent'
      },
      tabBarHideOnKeyboard: true,
      tabBarIcon: ({ color, size }) => {
        let Icon;

        switch (route.name) {
          case 'HomeTab':
            Icon = HomeIcon;
            break;
          case 'PercentageTab':
            Icon = PercentageIcon;
            break;
          case 'ChartTab':
            Icon = ChartIcon;
            break;
          case 'ProfileTab':
            Icon = ProfileIcon;
            break;
          default:
            Icon = HomeIcon;
            break;
        }

        return <Icon width={size} height={size} style={{ color }} />;
      }
    })}
  >
    <Tab.Screen name='HomeTab' component={HomeScreen} options={{ title: '', headerShown: false }} />
    <Tab.Screen name='PercentageTab' component={PercentageScreen} options={{ title: '', headerShown: false }} />
    <Tab.Screen name='ChartTab' component={ChartScreen} options={{ title: '', headerShown: false }} />
    <Tab.Screen name='ProfileTab' component={ProfileScreen} options={{ title: '', headerShown: false }} />
  </Tab.Navigator>
);

// Navegador de pila
const MainStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name='MainTabs' component={BottomTabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name='Settings' component={SettingsScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const App = () => (
  <GlobalProvider>
    <NavigationContainer>
      <StatusBar barStyle='light-content' backgroundColor='#0D1520' />
      <MainStackNavigator />
    </NavigationContainer>
  </GlobalProvider>
);

export default App;
