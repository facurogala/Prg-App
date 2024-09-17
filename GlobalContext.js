// GlobalContext.js
import React, { createContext, useState } from 'react';

// Crea el contexto
export const GlobalContext = createContext();

// Proveedor del contexto
export const GlobalProvider = ({ children }) => {
  const [saved1RMs, setSaved1RMs] = useState([]);

  // Función para agregar un nuevo 1RM
  const add1RM = (nuevoLevantamiento) => {
    const nuevosLevantamientos = [...saved1RMs, nuevoLevantamiento];
    setSaved1RMs(nuevosLevantamientos);
  };

  return (
    <GlobalContext.Provider value={{ saved1RMs, setSaved1RMs, add1RM }}>
      {children}
    </GlobalContext.Provider>
  );
};
