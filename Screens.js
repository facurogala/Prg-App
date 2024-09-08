import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  BackHandler,
  FlatList,
} from "react-native";
import { styles } from "./Styles";
import { useOneRM } from './OneRMContext';


export const HomeScreen = ({ navigation }) => {
  const [kg, setKg] = useState("");
  const [reps, setReps] = useState("");
  const [estimations, setEstimations] = useState([]);
  const { setOneRM } = useOneRM(); // Usa el contexto aquí
  

  useEffect(() => {
    const backAction = () => {
      navigation.goBack(); // Regresa a la pantalla anterior en la pila
      return true; // Prevenir el comportamiento predeterminado
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);


  useEffect(() => {
    const kgValue = parseFloat(kg);
    const repsValue = parseFloat(reps);
  
    if (!isNaN(kgValue) && !isNaN(repsValue) && repsValue > 0) {
      let calculatedOneRM;
      let repEstimations = [];
  
      if (repsValue === 1) {
        calculatedOneRM = kgValue;
      } else {
        calculatedOneRM = kgValue * (1 + 0.0333 * (repsValue - 1));
      }
  
      repEstimations.push({ reps: "1", weight: calculatedOneRM.toFixed(0) });
  
      for (let i = 2; i <= 20; i++) {
        const estimatedKg = (calculatedOneRM / (1 + 0.0333 * (i - 1))).toFixed(0);
        repEstimations.push({ reps: i, weight: estimatedKg });
      }
  
      setEstimations(repEstimations);
      setOneRM(calculatedOneRM.toFixed(2)); // Actualiza el contexto aquí
    } else {
      setOneRM(null);
      setEstimations([]);
    }
  }, [kg, reps, setOneRM]);

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

          {estimations.length > 0 && (
            <View style={styles.gridContainer}>
              {estimations.map((item) => (
                <View key={item.reps} style={styles.gridItem}>
                  <Text style={styles.repsText}>{item.reps}RM</Text>
                  <Text style={styles.weightTextInput}>{item.weight}</Text>
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

export const ChartScreen = ({ navigation }) => {
  return (
    <View style={styles.containerChart}>
      <Text style={styles.title}>Chart Screen</Text>
    </View>
  );
};

export const PercentageScreen = ({ navigation }) => {
  const { percentages } = useOneRM(); // Obtener los porcentajes desde el contexto

  const sortedPercentages = [...percentages].sort((a, b) => b.percentage - a.percentage);

  console.log('Sorted Percentages:', sortedPercentages);

  return (
    <View style={styles.containerPercentage}>
      <Text style={styles.title}>Porcentaje de 1RM</Text>
      <FlatList
        data={sortedPercentages}
        keyExtractor={(item) => item.percentage.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.percentageText}>{item.percentage}%</Text>
            <Text style={styles.weightTextPercentage}>{item.weight} kg</Text>
          </View>
        )}
      />
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
