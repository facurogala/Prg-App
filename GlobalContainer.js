// GlobalContainer.js
import React from 'react'
import { View, StyleSheet } from 'react-native'

const GlobalContainer = ({ children }) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0D1520', // Color del margen simulado
    padding: 20 // Simula el margen con padding
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#0D1520', // Color de fondo del contenido principal
    borderRadius: 10 // Opcional: para dar bordes redondeados al contenido
  }
})

export default GlobalContainer
