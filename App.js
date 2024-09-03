import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { Login, HomeScreen, SettingsScreen, ChartScreen, PorcentajeScreen, ProfileScreen } from "./Screens"; // Importar pantallas desde Screens.js




const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer theme={{ colors: { background: "#000" } }}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0D1520",
          },
          headerTintColor: "#0D1520",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          cardOverlayStyle: {
            backgroundColor: "#0D1520", // Color de fondo durante la transición
          },
          cardStyleInterpolator:
            TransitionPresets.FadeFromBottomAndroid.cardStyleInterpolator, // Aplicar la transición deseada
        }}
      >
     <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Inicio", headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Perfil", headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Configuración", headerShown: false  }}
        />
         <Stack.Screen
          name="Chart"
          component={ChartScreen}
          options={{ title: "Chart", headerShown: false  }}
        />
        <Stack.Screen
          name="Porcentaje"
          component={PorcentajeScreen}
          options={{ title: "Porcentaje", headerShown: false  }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profile", headerShown: false  }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


