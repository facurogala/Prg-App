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
            <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({route})  => ({
            tabBarIcon: ({focused, color, size}) => {
                let iconName;
                let rn = route.name;

                if (rn == homeName) {
                    iconName = focused ? "home" : "home-outline"
                } else if (rn === ChartName) {
                    iconName = focused ? "list" : "home-outline"
                } else if (rn === ProgfileName) {
                    iconName = focused ? "profile" : "home-outline"

                    return <Iconicons name ={iconName} size={size} color={color}/>
        
            },
            })}>

            <Tab.Screen name={homeName} component={HomeScreen}/>
                
                
             </Tab.Navigator>

        </NavigationContainer>

    ); 


};
