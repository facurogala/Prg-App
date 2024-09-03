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
import ConfigIcon from "./assets/tuerca.svg";
import ButtonBackIcon from "./assets/ButtonBackIcon.svg";
import NavHome from './assets/navHome.svg';
import Chart from './assets/Chart.svg'; 
import Porcentaje from './assets/porcentaje.svg'; 
import Profile from './assets/Profile.svg'; 
import { styles } from "./Styles";

export const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.PRG}
        source={require("./assets/Calavera_2_normal-removebg-preview.png")}
      />
      <Text style={styles.welcomeText}>Trackea tu Progreso.</Text>
      <Text style={styles.SubTitulo}>
        Y sincroniza con todos tus dispositivos.
      </Text>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <ConfigIcon width={24} height={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.profileChild, styles.profileLayout]}
        onPress={() => navigation.navigate("Home")}
      >
        <View style={styles.buttonContent}>
          <Image
            source={require("./assets/Google.png")}
            style={styles.iconGoogle}
          />
          <Text style={styles.continuarConGoogle}>Continuar con Google</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.profileFb, styles.profileFb2]}
        onPress={() => navigation.navigate("Home")}
      >
        <View style={styles.buttonContentFb}>
          <Image
            source={require("./assets/FB.png")}
            style={styles.iconFacebook}
          />
          <Text style={styles.continuarConFb}>Continuar con Facebook</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const HomeScreen = ({ navigation }) => {
  const [kg, setKg] = useState("");
  const [reps, setReps] = useState("");
  const [oneRM, setOneRM] = useState(null);
  const [estimations, setEstimations] = useState([]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Login");
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
    <KeyboardAvoidingView style={styles.mainContainer}>
    {/* Asegúrate de que el contenedor principal tenga un estilo adecuado */}
    <View style={styles.mainContainer}>
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
                  placeholder="250"
                  keyboardType="numeric"
                  placeholderTextColor="white"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.labelText}>Reps</Text>
                <TextInput
                  style={styles.textInputKgReps}
                  onChangeText={(text) => setReps(text)}
                  value={reps}
                  placeholder="6"
                  keyboardType="numeric"
                  placeholderTextColor="white"
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

        <View style={styles.containerNavBar}>
        <TouchableOpacity style={styles.navHome} onPress={() => navigation.navigate("Home")}>
          <NavHome width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.Chart} onPress={() => navigation.navigate("Search")}>
          <Chart width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.porcentaje} onPress={() => navigation.navigate("Notifications")}>
          <Porcentaje width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.Profile} onPress={() => navigation.navigate("Profile")}>
          <Profile width={24} height={24} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>


  );
};

export const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleConfig}>Pantalla de Configuración</Text>
      <TouchableOpacity
        style={styles.ButtonBack}
        onPress={() => navigation.navigate("Login")}
      >
        <ButtonBackIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
};
