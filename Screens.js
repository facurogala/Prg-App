import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  BackHandler,
} from "react-native";
import ConfigIcon from "./assets/Setting.svg";
import NavHome from './assets/Home.svg';
import Chart from './assets/Chart.svg'; 
import Porcentaje from './assets/Percentage.svg'; 
import Profile from './assets/Profile.svg'; 
import { styles } from "./Styles";



export const HomeScreen = ({ navigation }) => {
  const [kg, setKg] = useState("");
  const [reps, setReps] = useState("");
  const [oneRM, setOneRM] = useState(null);
  const [estimations, setEstimations] = useState([]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Home");
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const kgValue = parseFloat(kg);
    const repsValue = parseFloat(reps);

    if (!isNaN(kgValue) && !isNaN(repsValue) && repsValue > 0) {
      const result = kgValue * (1 + 0.0333 * repsValue);
      setOneRM(result.toFixed(2));

      const repEstimations = [];
      for (let i = 2; i <= 20; i++) {
        const estimatedKg = (result / (1 + 0.0333 * i)).toFixed(0);
        repEstimations.push({ reps: i, weight: estimatedKg });
      }

      setEstimations([{ reps: "1", weight: result.toFixed(0) }, ...repEstimations]);
    } else {
      setOneRM(null);
      setEstimations([]);
    }
  }, [kg, reps]);

  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior="padding">
      <View style={styles.mainContainer}>
      <TouchableOpacity 
        style={styles.settingButton} 
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
        <Image style={styles.PrgVerde} source={require("./assets/PRG.png")} />
        <Text style={styles.Calcula1Rmhead}>Calcula tu 1RM</Text>
        <View style={styles.containerHomeCalculatorInput}>
          <View style={styles.inputContainerTodo}>
            <View style={styles.inputWrapper}>
              <Text style={styles.labelText}>Kg</Text>
              <TextInput
                style={styles.textInputKgReps}
                onChangeText={(text) => setKg(text)}
                value={kg}
                placeholder=""
                keyboardType="numeric"
                placeholderTextColor="white"
                maxLength={3} 
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.labelText}>Reps</Text>
              <TextInput
                style={styles.textInputKgReps}
                onChangeText={(text) => setReps(text)}
                value={reps}
                placeholder=""
                keyboardType="numeric"
                placeholderTextColor="white"
                maxLength={3} 
              />
            </View>
          </View>

          {oneRM && estimations.length > 0 && (
            <View style={styles.gridContainer}>
              {estimations.map((item) => (
                <View key={item.reps} style={styles.gridItem}>
                  <Text style={styles.repsText}>{item.reps}RM</Text>
                  <Text style={styles.weightText}>{item.weight}</Text>
                  <Text style={styles.kgText}>kg</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.containerSetting}>
      <Text style={styles.titleConfig}>Pantalla de Configuración</Text>
    </View>
  );
};

// Pantalla Chart
export const ChartScreen = ({ navigation }) => {
  return (
    <View style={styles.containerChart}>
      <Text style={styles.title}>Chart Screen</Text>
    </View>
  );
};



export const PercentageScreen = ({ navigation }) => {
  return (
    <View style={styles.containerPercentage}>
      <Text style={styles.title}>Porcentaje Screen</Text>
    </View>
  );
};

export const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.containerProfile}>
      <Text style={styles.title}>Profile Screen</Text>
    </View>
  );
};


