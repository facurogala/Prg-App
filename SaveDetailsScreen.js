import React, { useState, useContext, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNPickerSelect from 'react-native-picker-select'
import { GlobalContext } from './GlobalContext'
import { CommonActions } from '@react-navigation/native'

const SaveDetailsScreen = ({ route, navigation }) => {
  const { kg, reps, oneRM, date } = route.params || {}
  const [note, setNote] = useState('')
  const [exercise, setExercise] = useState('Elegir')
  const [rpe, setRpe] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date(date || Date.now()))
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateMode, setDateMode] = useState('date')
  const { setSaved1RMs } = useContext(GlobalContext)

  useEffect(() => {
    if (route.params) {
      const { note: incomingNote, exercise: incomingExercise, rpe: incomingRpe } = route.params
      setNote(incomingNote || '')
      setExercise(incomingExercise || 'Elegir')
      setRpe(incomingRpe || null)
      setSelectedDate(date ? new Date(date) : new Date())
    }
  }, [route.params])

  const handleSave = async () => {
    if (exercise === 'Elegir' || !exercise) {
      Alert.alert('Error', 'Por favor selecciona un ejercicio.')
      return
    }

    const dataToSave = {
      id: route.params?.id || Date.now().toString(), // Usa el id si está disponible o genera uno nuevo
      oneRM,
      kg,
      reps,
      note,
      exercise,
      rpe,
      date: selectedDate.toISOString()
    }

    try {
      const currentData = await AsyncStorage.getItem('@saved1RMs')
      const parsedData = currentData ? JSON.parse(currentData) : []

      // Busca el índice del 1RM existente (si existe)
      const existingIndex = parsedData.findIndex((item) => item.id === dataToSave.id)

      if (existingIndex !== -1) {
        // Modificar el 1RM existente
        parsedData[existingIndex] = dataToSave
      } else {
        // Agregar un nuevo 1RM
        parsedData.push(dataToSave)
      }

      await AsyncStorage.setItem('@saved1RMs', JSON.stringify(parsedData))
      setSaved1RMs(parsedData)

      navigation.dispatch(
        CommonActions.navigate({
          name: 'MainTabs',
          params: { screen: 'PercentageTab' }
        })
      )
    } catch (error) {
      console.error('Error al guardar el levantamiento', error)
    }
  }

  const handleDateChange = (_event, selected) => {
    setShowDatePicker(false)
    if (selected) {
      setSelectedDate(selected)
    }
  }

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.label}>Ejercicio Realizado:</Text>
      <RNPickerSelect
        onValueChange={(value) => setExercise(value)}
        items={[
          { label: 'Sentadilla', value: 'Sentadilla' },
          { label: 'Peso Muerto', value: 'Peso Muerto' },
          { label: 'Banco Plano', value: 'Banco Plano' }
        ]}
        placeholder={{ label: 'Elige un ejercicio...', value: null }}
        style={pickerSelectDarkStyles}
        value={exercise}
      />

      <Text style={styles.label}>Notas:</Text>
      <TextInput
        style={styles.textInput}
        placeholder='Escribe un comentario (opcional)'
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={500}
      />

      <Text style={styles.label}>RPE (Opcional):</Text>
      <RNPickerSelect
        onValueChange={(value) => setRpe(value)}
        items={Array.from({ length: 10 }, (_, i) => ({
          label: `${i + 1}`,
          value: i + 1
        }))}
        placeholder={{ label: 'Elige un valor de RPE (opcional)...', value: null }}
        style={pickerSelectDarkStyles}
        value={rpe}
      />

      <Text style={styles.label}>Fecha y Hora:</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true)
            setDateMode('date')
          }}
        >
          <Text style={styles.dateTimeText}>{selectedDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true)
            setDateMode('time')
          }}
        >
          <Text style={styles.dateTimeText}>{selectedDate.toLocaleTimeString()}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode={dateMode}
          display='default'
          onChange={handleDateChange}
          themeVariant='dark'
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // Estilos existentes
  detailsContainer: {
    backgroundColor: '#0D1520',
    flex: 1,
    padding: 20
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    color: '#ccc'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#212836',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: '#fff'
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10
  },
  dateTimeText: {
    fontSize: 16,
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#212836',
    borderRadius: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#D9E92C',
    borderRadius: 5
  },
  saveButtonText: {
    textAlign: 'center',
    color: 'black'
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5
  },
  cancelButtonText: {
    textAlign: 'center',
    color: 'white'
  }
})

const pickerSelectDarkStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#212836',
    borderRadius: 5,
    color: 'white',
    backgroundColor: '#212836'
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#212836',
    borderRadius: 5,
    color: 'white',
    backgroundColor: '#212836'
  }
}

export default SaveDetailsScreen
