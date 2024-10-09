// DateSelector.js
import React from 'react'
import { Modal, View, Text, Button } from 'react-native'

const DateSelector = ({ isVisible, onClose, onDateSelect }) => {
  // Aquí podrías implementar la lógica para seleccionar una fecha
  const handleDateSelect = () => {
    // Simulación de selección de fecha
    const selectedDate = new Date().toLocaleDateString()
    onDateSelect(selectedDate)
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Select a Date</Text>
        <Button title='Select Today' onPress={handleDateSelect} />
        <Button title='Close' onPress={onClose} />
      </View>
    </Modal>
  )
};

export default DateSelector
//