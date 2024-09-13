import React, { useState, useEffect, useContext } from 'react'
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


export const HomeScreen = ({ navigation }) => {
  const [kg, setKg] = useState('')
  const [reps, setReps] = useState('')
  const [date, setDate] = useState(new Date()) // Agregar estado para la fecha
  const [showDatePicker, setShowDatePicker] = useState(false) // Mostrar el selector de fecha
  const [estimations, setEstimations] = useState(
    Array.from({ length: 20 }, (_, i) => ({ reps: i + 1, weight: '' })) // Inicializa con 20 boxes vacíos
  )
  const [percentages, setPercentages] = useState([]) // Estado local para almacenar porcentajes
  const { add1RM } = useContext(GlobalContext);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack() // Regresa a la pantalla anterior en la pila
      return true // Prevenir el comportamiento predeterminado
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [navigation])

  useEffect(() => {
    const kgValue = parseFloat(kg)
    const repsValue = parseFloat(reps)

    if (!isNaN(kgValue) && !isNaN(repsValue) && repsValue > 0) {
      let calculatedOneRM
      const repEstimations = []

      if (repsValue === 1) {
        calculatedOneRM = kgValue
      } else {
        calculatedOneRM = kgValue * (1 + 0.0333 * (repsValue - 1))
      }

      repEstimations.push({ reps: '1', weight: calculatedOneRM.toFixed(0) })

      for (let i = 2; i <= 20; i++) {
        const estimatedKg = (calculatedOneRM / (1 + 0.0333 * (i - 1))).toFixed(0)
        repEstimations.push({ reps: i, weight: estimatedKg })
      }

      setEstimations(repEstimations)

      // Calcular los porcentajes basados en el valor de 1RM
      const newPercentages = Array.from({ length: 12 }, (_, index) => {
        const percentage = 125 - index * 5 // Calcula el porcentaje desde 125% hasta 30%
        const weight = (calculatedOneRM * (percentage / 100)).toFixed(0) // Calcula el peso basado en el 1RM
        return { percentage, weight }
      })

      setPercentages(newPercentages) // Actualiza el estado de porcentajes
    } else {
      setEstimations(
        Array.from({ length: 20 }, (_, i) => ({ reps: i + 1, weight: '' })) // Reinicia a boxes vacíos
      )
      setPercentages([]) // Reinicia los porcentajes
    }
  }, [kg, reps])

  // Dividir la lista en dos columnas
  const firstColumn = percentages.slice(0, Math.ceil(percentages.length / 2))
  const secondColumn = percentages.slice(Math.ceil(percentages.length / 2))

  const handleSave = () => {
    const oneRM = estimations[0]?.weight // Asumiendo que el primer elemento es el 1RM calculado
    const dataToSave = { oneRM, kg, reps, date: date.toLocaleDateString() } // Usar la fecha seleccionada

    add1RM(dataToSave) // Guarda los datos
    navigation.navigate('PercentageTab');
  }

  const showDatepicker = () => {
    setShowDatePicker(true) // Mostrar el selector de fecha
  }

  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior='padding'>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.buttonText}>Settings</Text>
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
                  placeholder=''
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
                  placeholder=''
                  keyboardType='numeric'
                  placeholderTextColor='white'
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.gridContainer}>
              {estimations.map((item) => (
                <View key={item.reps} style={styles.gridItem}>
                  <Text style={styles.repsText}>{item.reps}RM</Text>
                  <Text style={styles.weightTextInput}>{item.weight !== '' ? item.weight : ''}</Text>
                  <Text style={styles.kgText}>kg</Text>
                </View>
              ))}
            </View>

            <View style={styles.percentagesContainer}>
              {/* Título */}
              <View>
                <Text style={styles.textPorcent}>Porcentajes</Text>
              </View>

              {/* Contenedor de columnas */}
              <View style={styles.percentagesBox}>
                {/* Columna Izquierda */}
                <View style={styles.column}>
                  {firstColumn.map((item) => (
                    <View key={item.percentage} style={styles.row}>
                      <Text style={styles.percentageTextLeft}>{item.percentage}%</Text>
                      <Text style={styles.weightTextLeft}>{item.weight} kg</Text>
                    </View>
                  ))}
                </View>

                {/* Separador */}
                <View style={styles.separator} />

                {/* Columna Derecha */}
                <View style={styles.column2}>
                  {secondColumn.map((item) => (
                    <View key={item.percentage} style={styles.row}>
                      <Text style={styles.percentageTextRight}>{item.percentage}%</Text>
                      <Text style={styles.weightTextRight}>{item.weight} kg</Text>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>Guardar 1RM</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Botón para mostrar el selector de fecha */}
            <TouchableOpacity onPress={showDatepicker}>
              <Text style={styles.buttonText}>Seleccionar Fecha</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode='date'
                display='default'
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false)
                  if (selectedDate) {
                    setDate(selectedDate)
                  }
                }}
              />
            )}
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
  const { saved1RMs } = useContext(GlobalContext) // Obtén los datos guardados

  return (
    <ScrollView style={styles.containerPercentage}>
      {saved1RMs.length > 0
        ? (
            saved1RMs.map((item, index) => (
              <View key={index} style={styles.saved1RMBox}>
                <Text style={styles.savedText}>1RM: {item.oneRM} kg</Text>
                <Text style={styles.savedText}>Peso: {item.kg} kg</Text>
                <Text style={styles.savedText}>Repeticiones: {item.reps}</Text>
                <Text style={styles.savedText}>Fecha: {item.date}</Text>
              </View>
            ))
          )
        : (
          <Text style={styles.noDataText}>No hay datos guardados.</Text>
          )}
    </ScrollView>
  )
}

export const ProfileScreen = () => {
  return (
    <View style={styles.containerProfile}>
      <Text style={styles.title}>Profile Screen</Text>
    </View>
  )
}
