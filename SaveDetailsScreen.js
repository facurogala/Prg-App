import React, { useState, useContext, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNPickerSelect from 'react-native-picker-select'
import { GlobalContext } from './GlobalContext'

const SaveDetailsScreen = ({ route, navigation }) => {
  const { kg, reps, oneRM, date } = route.params || {}
  const [note, setNote] = useState('')
  const [exercise, setExercise] = useState('Elegir')
  const [rpe, setRpe] = useState(null) // Estado para el RPE, pero ahora es opcional
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
      oneRM,
      kg,
      reps,
      note,
      exercise,
      rpe, // Incluye el valor de RPE si se selecciona, pero no es obligatorio
      date: selectedDate.toISOString()
    }

    try {
      const currentData = await AsyncStorage.getItem('@saved1RMs')
      const parsedData = currentData ? JSON.parse(currentData) : []
      const existingIndex = parsedData.findIndex(
        (item) =>
          item.oneRM === oneRM && item.kg === kg && item.reps === reps && item.date === date
      )

      let updatedData
      if (existingIndex !== -1) {
        parsedData[existingIndex] = dataToSave
        updatedData = parsedData
      } else {
        updatedData = [...parsedData, dataToSave]
      }

      await AsyncStorage.setItem('@saved1RMs', JSON.stringify(updatedData))
      setSaved1RMs(updatedData)
      navigation.navigate('PercentageTab', { note: note })
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
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Kilogramos</Text>
          <Text style={styles.summaryValue}>{kg} kg</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Reps</Text>
          <Text style={styles.summaryValue}>{reps}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>1RM Estimado</Text>
          <Text style={styles.summaryValue}>{oneRM} kg</Text>
        </View>
      </View>

      <Text style={styles.label}>Ejercicio Realizado:</Text>
      <RNPickerSelect
        onValueChange={(value) => setExercise(value)}
        items={[
          { label: 'Sentadilla', value: 'Sentadilla' },
          { label: 'Peso Muerto', value: 'Peso Muerto' },
          { label: 'Banco Plano', value: 'Banco Plano' }
        ]}
        placeholder={{ label: 'Elige un ejercicio...', value: null }}
        style={pickerSelectDarkStyles} // Aplicar el estilo oscuro
        value={exercise}
      />

      <Text style={styles.label}>Notas:</Text>
      <TextInput
        style={styles.textInput}
        placeholder='Escribe un comentario (opcional)'
        placeholderTextColor='white'
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={500}
      />

      <Text style={styles.label}>RPE (Opcional):</Text>
      <RNPickerSelect
        onValueChange={(value) => setRpe(value)}
        items={[
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 },
          { label: '6', value: 6 },
          { label: '7', value: 7 },
          { label: '8', value: 8 },
          { label: '9', value: 9 },
          { label: '10', value: 10 }
        ]}
        placeholder={{ label: 'Elige un valor de RPE (opcional)...', value: null }}
        style={pickerSelectDarkStyles} // Aplicar el estilo oscuro
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
    marginTop: 1,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    color: 'white'
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white'
  },
  summaryValue: {
    fontSize: 20,
    marginTop: 5,
    color: 'white'
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

// Estilos personalizados para el picker con fondo oscuro
const pickerSelectDarkStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#212836',
    borderRadius: 5,
    color: 'white',
    paddingRight: 30,
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
    paddingRight: 30,
    backgroundColor: '#212836'
  },
  modalViewBottom: {
    backgroundColor: '#0D1520', // Fondo oscuro para el popup
  }
}

export default SaveDetailsScreen
