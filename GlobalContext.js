// GlobalContext.js
import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [saved1RMs, setSaved1RMs] = useState([]);

  const add1RM = async (newLift) => {
    try {
      // Agregar el nuevo levantamiento al estado actual
      const updatedLifts = [...saved1RMs, newLift];
      // Guardar los levantamientos actualizados en AsyncStorage
      await AsyncStorage.setItem('@saved1RMs', JSON.stringify(updatedLifts));
      // Actualizar el estado con los nuevos levantamientos
      setSaved1RMs(updatedLifts);
    } catch (error) {
      console.error('Error al guardar el levantamiento:', error);
    }
  };

  return (
    <GlobalContext.Provider value={{ saved1RMs, setSaved1RMs, add1RM }}>
      {children}
    </GlobalContext.Provider>
  );
};
//