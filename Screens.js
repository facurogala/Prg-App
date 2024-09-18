// HomeScreen.js
import React, { useState, useEffect, useContext, useMemo } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  BackHandler,
  ScrollView
} from 'react-native'
import { styles } from './Styles'
import DateTimePicker from '@react-native-community/datetimepicker'
import { GlobalContext } from './GlobalContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobalContainer from './GlobalContainer'

const isValidInput = (kg, reps) => {
  return !isNaN(parseFloat(kg)) && !isNaN(parseFloat(reps)) && parseFloat(reps) > 0
}

export const HomeScreen = ({ navigation }) => {
  const [kg, setKg] = useState('')
  const [reps, setReps] = useState('')
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [estimations, setEstimations] = useState(
    Array.from({ length: 20 }, (_, i) => ({ reps: i + 1, weight: '' }))
  )
  const [percentages, setPercentages] = useState([])

  const { add1RM } = useContext(GlobalContext)

  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [navigation])

  useEffect(() => {
    if (isValidInput(kg, reps)) {
      const kgValue = parseFloat(kg)
      const repsValue = parseFloat(reps)
      const calculatedOneRM = repsValue === 1 ? kgValue : kgValue * (1 + 0.0333 * (repsValue - 1))
      const repEstimations = [{ reps: '1', weight: calculatedOneRM.toFixed(0) }]

      for (let i = 2; i <= 20; i++) {
        const estimatedKg = (calculatedOneRM / (1 + 0.0333 * (i - 1))).toFixed(0)
        repEstimations.push({ reps: i, weight: estimatedKg })
      }

      setEstimations(repEstimations)

      const newPercentages = Array.from({ length: 12 }, (_, index) => {
        const percentage = 125 - index * 5
        const weight = (calculatedOneRM * (percentage / 100)).toFixed(0)
        return { percentage, weight }
      })

      setPercentages(newPercentages)
    } else {
      setEstimations(Array.from({ length: 20 }, (_, i) => ({ reps: i + 1, weight: '' })))
      setPercentages([])
    }
  }, [kg, reps])

  // División de porcentajes en dos columnas en orden descendente
  const firstColumn = useMemo(() => percentages.slice(0, Math.ceil(percentages.length / 2)), [percentages])
  const secondColumn = useMemo(() => percentages.slice(Math.ceil(percentages.length / 2)), [percentages])

  const handleSave = () => {
    if (estimations[0]?.weight) {
      const oneRM = estimations[0].weight
      navigation.navigate('SaveDetails', {
        kg,
        reps,
        oneRM,
        date: date.toISOString() // Pasa la fecha correctamente
      })
    }
  }

  const showDatepicker = () => {
    setShowDatePicker(true)
  }

  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior='padding'>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.buttonText1RM}>Settings</Text>
          </TouchableOpacity>
          <Image style={styles.PrgVerde} source={require('./assets/PRG.png')} />
          <Text style={styles.Calcula1Rmhead}>Calcula tu 1RM</Text>

          <View style={styles.containerHomeCalculatorInput}>
            <View style={styles.inputContainerTodo}>
              <View style={styles.inputWrapper}>
                <Text style={styles.labelText}>Kg</Text>
                <TextInput
                  style={styles.textInputKgReps}
                  onChangeText={(text) => setKg(text)}
                  value={kg}
                  keyboardType='numeric'
                  placeholderTextColor='white'
                  maxLength={3}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.labelText}>Reps</Text>
                <TextInput
                  style={styles.textInputKgReps}
                  onChangeText={(text) => setReps(text)}
                  value={reps}
                  keyboardType='numeric'
                  placeholderTextColor='white'
                  maxLength={3}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton1RM} onPress={handleSave}>
              <Text style={styles.buttonText1RM}>Guardar 1RM</Text>
            </TouchableOpacity>

            <View style={styles.gridContainer}>
              {estimations.map((item) => (
                <View key={item.reps} style={styles.gridItem}>
                  <Text style={styles.repsText}>{item.reps}RM</Text>
                  <Text style={styles.weightTextInput}>
                    {item.weight !== '' ? item.weight : ''}
                  </Text>
                  <Text style={styles.kgText}>kg</Text>
                </View>
              ))}
            </View>

            <View style={styles.percentagesContainer}>
              <Text style={styles.textPorcent}>Porcentajes del 1RM</Text>
              <View style={styles.percentagesBox}>
                {/* Columna 1 */} 
                <View style={styles.column1}>
                  {firstColumn.map((item) => (
                    <View key={item.percentage} style={styles.invisibleBox}>
                      <Text style={styles.percentageTextLeft}>{item.percentage}%</Text>
                      <Text style={styles.weightTextLeft}>{item.weight} kg</Text>
                    </View>
                  ))}
                </View>

                {/* Columna 2 */} 
                <View style={styles.column2}>
                  {secondColumn.map((item) => (
                    <View key={item.percentage} style={styles.invisibleBox}>
                      <Text style={styles.percentageTextLeft}>{item.percentage}%</Text>
                      <Text style={styles.weightTextLeft}>{item.weight} kg</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}



export const SettingsScreen = () => {
  return (
    <View style={styles.containerSetting}>
      <Text style={styles.titleConfig}>Pantalla de Configuración</Text>
    </View>
  )
}

export const ChartScreen = () => {
  return (
    <View style={styles.containerChart}>
      <Text style={styles.title}>Chart Screen</Text>
    </View>
  )
}

export const PercentageScreen = () => {
  const { saved1RMs, setSaved1RMs } = useContext(GlobalContext)

  useEffect(() => {
    const cargarLevantamientos = async () => {
      try {
        const levantamientosGuardados = await AsyncStorage.getItem('@saved1RMs')
        setSaved1RMs(levantamientosGuardados ? JSON.parse(levantamientosGuardados) : [])
      } catch (error) {
        console.error('Error al cargar levantamientos', error)
      }
    }
    cargarLevantamientos()
  }, [])

  const eliminarLevantamiento = async (index) => {
    try {
      const nuevosLevantamientos = saved1RMs.filter((_, i) => i !== index)
      await AsyncStorage.setItem('@saved1RMs', JSON.stringify(nuevosLevantamientos))
      setSaved1RMs(nuevosLevantamientos)
    } catch (error) {
      console.error('Error al eliminar el levantamiento', error)
    }
  }

  return (
    <GlobalContainer>
      <ScrollView style={styles.containerPercentage}>
        {saved1RMs.length > 0
          ? (
              saved1RMs.map((item, index) => (
                <View key={index} style={styles.saved1RMBox}>
                  <Text style={styles.savedText}>1RM: {item.oneRM} kg</Text>
                  <Text style={styles.savedText}>Peso: {item.kg} kg</Text>
                  <Text style={styles.savedText}>Repeticiones: {item.reps}</Text>
                  <Text style={styles.savedText}>Fecha: {item.date}</Text>
                  <TouchableOpacity onPress={() => eliminarLevantamiento(index)}>
                    <Text style={{ color: 'red', marginTop: 10 }}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              ))
            )
          : (
            <Text style={styles.noDataText}>No hay datos guardados.</Text>
            )}
      </ScrollView>
    </GlobalContainer>
  )
}

export const ProfileScreen = () => {
  return (
    <View style={styles.containerProfile}>
      <Text style={styles.title}>Profile Screen</Text>
    </View>
  )
}
