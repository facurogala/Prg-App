import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileScreen, HomeScreen, SettingsScreen, ChartScreen, PercentagejeScreen } from './Screens';
import { KeyboardAvoidingView, Platform } from 'react-native';

// Creación de los navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Estilos para la navegación
const navigationStyles = {
  tabBarStyle: {
    backgroundColor: '#0D1520',
  },
};

// Estilos para la barra de navegación inferior
const bottomTabStyles = {
  tabBarStyle: {
    backgroundColor: '#0D1520',
  },
};

const BottomTabNavigator = () => (
  <Tab.Navigator screenOptions={bottomTabStyles}>
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{ title: 'Inicio', headerShown: false }}
    />
    <Tab.Screen
      name="PorcentajeTab"
      component={PercentagejeScreen}
      options={{ title: 'Porcentaje', headerShown: false }}
    />
    <Tab.Screen
      name="ChartTab"
      component={ChartScreen}
      options={{ title: 'Chart', headerShown: false }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{ title: 'Perfil', headerShown: false }}
    />
  </Tab.Navigator>
);

// Estilos para la pantalla principal
const appStyles = {
  flex: 1,
};

// Componente principal
const App = () => {
  return (
    <KeyboardAvoidingView style={appStyles} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <NavigationContainer theme={{ colors: { background: '#000' } }}>
        <Stack.Navigator
          initialRouteName="BottomTabs"
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#0D1520',
            },
            headerTintColor: '#FFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardOverlayStyle: {
              backgroundColor: '#0D1520',
            },
            cardStyleInterpolator: TransitionPresets.FadeFromBottomAndroid.cardStyleInterpolator,
          }}
        >
          <Stack.Screen
            name="BottomTabs"
            component={BottomTabNavigator}
            options={{ title: 'Inicio', headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </KeyboardAvoidingView>
  );
};

export default App;