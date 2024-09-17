import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalContext } from './GlobalContext'; // Importa el contexto global
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación

const SaveDetailsScreen = ({ route }) => {
  const { kg, reps, oneRM, date } = route.params;
  const navigation = useNavigation(); // Usar el hook de navegación

  const [note, setNote] = useState('');
  const [exercise, setExercise] = useState('sentadilla');
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateMode, setDateMode] = useState('date'); // Controlar si se muestra la fecha o la hora
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const { setSaved1RMs } = useContext(GlobalContext); // Usa el contexto para actualizar el estado global

  const handleSave = async () => {
    const dataToSave = {
      oneRM,
      kg,
      reps,
      note,
      exercise,
      date: selectedDate.toLocaleDateString(),
    };

    try {
      // Obtén los levantamientos guardados actualmente
      const currentData = await AsyncStorage.getItem('@saved1RMs');
      const parsedData = currentData ? JSON.parse(currentData) : [];

      // Agrega el nuevo levantamiento
      const updatedData = [...parsedData, dataToSave];

      // Guarda los datos actualizados en AsyncStorage
      await AsyncStorage.setItem('@saved1RMs', JSON.stringify(updatedData));

      // Actualiza el estado global con los datos actualizados
      setSaved1RMs(updatedData);

      // Navega a la pantalla de porcentajes
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
      <Text style={styles.title}>Detalles del Levantamiento</Text>

      <Text style={styles.label}>Ejercicio Realizado:</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setShowExerciseModal(true)}>
        <Text style={styles.pickerButtonText}>{exercise}</Text>
      </TouchableOpacity>

      <Modal
        visible={showExerciseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {['Sentadilla', 'Peso Muerto', 'Banco Plano'].map((ex) => (
              <TouchableOpacity
                key={ex}
                style={styles.optionButton}
                onPress={() => {
                  setExercise(ex.toLowerCase());
                  setShowExerciseModal(false);
                }}
              >
                <Text style={styles.optionText}>{ex}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.optionButton, styles.cancelButton]}
              onPress={() => setShowExerciseModal(false)}
            >
              <Text style={styles.optionText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Notas:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Escribe un comentario"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <Text style={styles.label}>Fecha y Hora:</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity onPress={() => { setShowDatePicker(true); setDateMode('date'); }}>
          <Text style={styles.dateTimeText}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setShowDatePicker(true); setDateMode('time'); }}>
          <Text style={styles.dateTimeText}>
            {selectedDate.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode={dateMode}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.summaryContainer}>
        <Text>Kilaje: {kg} kg</Text>
        <Text>Repeticiones: {reps}</Text>
        <Text>1RM Estimado: {oneRM} kg</Text>
      </View>

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
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  pickerButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#007BFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SaveDetailsScreen;
