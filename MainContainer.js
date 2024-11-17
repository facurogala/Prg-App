import * as React from "react;

import {NavigationContainer} from "@react-navigation/native"
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs"

//Screens
import HomeScreen from "./Screens"
import ChartScreen from "./Screens"
import PorcentajeScreen from "./Screens"
import ProfileScreen from "./Screens"
import Ionicons from "react-native-vector-icons/Iconics"


//Screen names
const homeName = "Home";
const chartName = "Chart";
const porcentajeName = "Porcentaje";
const profileName  = "Profile"; 

const tab = createBottomTabNavigator();

export default function MainContainer() {
    return (
        <NavigationContainer>
            <tab.Navigator
            initialRouteName={homeName}
            screenOptions={({route})  => ({
            tabBarIcon: ({focused, color, size}) => {
                let iconName;
                let rn = route.name;

                if (rn == homeName) {
                    iconName = focused ? "home" : "home-outline"
                } else if (rn === chartName) {
                    iconName = focused ? "list" : "home-outline"
                } else if (rn === profileName) {
                    iconName = focused ? "profile" : "home-outline"

                    return <Ionicons name ={iconName} size={size} color={color}/>
        
            },
            })}>

            <tab.Screen name={homeName} component={HomeScreen}/>
                
                
             </tab.Navigator>

        </NavigationContainer>

    ); 


};
