import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select'; // Importa el componente de selector
import { GlobalContext } from './GlobalContext'; // Importa el contexto global

const SaveDetailsScreen = ({ route, navigation }) => {
  const { kg, reps, oneRM, date } = route.params || {};
  const [note, setNote] = useState('');
  const [exercise, setExercise] = useState('Elegir');
  const [selectedDate, setSelectedDate] = useState(new Date(date || Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateMode, setDateMode] = useState('date'); // Controlar si se muestra la fecha o la hora
  const { setSaved1RMs } = useContext(GlobalContext); // Usa el contexto para actualizar el estado global

  useEffect(() => {
    if (route.params) {
      const { note, exercise } = route.params;
      setNote(note || '');
      setExercise(exercise || 'Elegir');
    }
  }, [route.params]);

  const handleSave = async () => {
    if (exercise === 'Elegir' || !exercise) {
      Alert.alert('Error', 'Por favor selecciona un ejercicio.');
      return;
    }
  
    const dataToSave = {
      oneRM,
      kg,
      reps,
      note,
      exercise,
      date: selectedDate.toISOString(), // Asegúrate de guardar la fecha como un string ISO
    };
  
    try {
      const currentData = await AsyncStorage.getItem('@saved1RMs');
      const parsedData = currentData ? JSON.parse(currentData) : [];
      const existingIndex = parsedData.findIndex(
        (item) =>
          item.oneRM === oneRM && item.kg === kg && item.reps === reps && item.date === date
      );
  
      let updatedData;
      if (existingIndex !== -1) {
        parsedData[existingIndex] = dataToSave;
        updatedData = parsedData;
      } else {
        updatedData = [...parsedData, dataToSave];
      }
  
      await AsyncStorage.setItem('@saved1RMs', JSON.stringify(updatedData));
      setSaved1RMs(updatedData);
      navigation.navigate('PercentageTab');
    } catch (error) {
      console.error('Error al guardar el levantamiento', error);
    }
  };

  const handleDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

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
          { label: 'Banco Plano', value: 'Banco Plano' },
        ]}
        placeholder={{ label: 'Elige un ejercicio...', value: null }}
        style={pickerSelectStyles}
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

      <Text style={styles.label}>Fecha y Hora:</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
            setDateMode('date');
          }}
        >
          <Text style={styles.dateTimeText}>{selectedDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
            setDateMode('time');
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
  );
};
const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: '#0D1520',
    flex: 1,
    padding: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    color: '#ccc',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#212836',
    padding: 10,
    marginTop: 1,
    marginBottom: 10,
    borderRadius: 5,
    color: '#fff',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
  },
  dateTimeText: {
    fontSize: 16,
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#212836',
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    color: 'white',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryValue: {
    fontSize: 20,
    marginTop: 5,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#D9E92C',
    borderRadius: 5,
  },
  saveButtonText: {
    textAlign: 'center',
    color: 'black',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: 'white',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#212836',
    borderRadius: 5,
    color: 'white',
    paddingRight: 30,
    backgroundColor: '#212836',
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
    backgroundColor: '#212836',
  },
});

export default SaveDetailsScreen;