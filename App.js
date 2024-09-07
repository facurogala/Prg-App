import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { ProfileScreen, HomeScreen, ChartScreen, PercentagejeScreen } from './Screens';
import HomeIcon from './assets/Home.svg';
import PercentageIcon from './assets/Percentage.svg';
import ChartIcon from './assets/Chart.svg';
import ProfileIcon from './assets/Profile.svg';

// Creación del navegador de pestañas inferior
const Tab = createBottomTabNavigator();

// Componente principal con la barra de navegación inferior
const App = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#0D1520" />
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#0D1520', // Color de fondo de la barra de navegación
          borderTopWidth: 0, // Quita el borde superior
          borderTopColor: 'transparent', // Asegúrate de que el color del borde sea transparente
        },
        tabBarHideOnKeyboard: true,
        headerShown: false, // Oculta el encabezado para todas las pantallas
        tabBarIcon: ({ color, size }) => {
          let Icon;

          switch (route.name) {
            case 'HomeTab':
              Icon = HomeIcon;
              break;
            case 'PorcentajeTab':
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

          return <Icon width={size} height={size} style={{ color: color }} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: '', headerShown: false }} // Asegura que el encabezado esté oculto
      />
      <Tab.Screen
        name="PorcentajeTab"
        component={PercentagejeScreen}
        options={{ title: '', headerShown: false }} // Asegura que el encabezado esté oculto
      />
      <Tab.Screen
        name="ChartTab"
        component={ChartScreen}
        options={{ title: '', headerShown: false }} // Asegura que el encabezado esté oculto
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: '', headerShown: false }} // Asegura que el encabezado esté oculto
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;
