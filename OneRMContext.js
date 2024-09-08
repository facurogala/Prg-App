// OneRMContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const OneRMContext = createContext();

export const OneRMProvider = ({ children }) => {
  const [oneRM, setOneRM] = useState(null);
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    if (oneRM !== null) {
      const newPercentages = [];
      for (let i = 5; i <= 125; i += 5) {
        newPercentages.push({
          percentage: i,
          weight: (oneRM * (i / 100)).toFixed(0),
        });
      }
      setPercentages(newPercentages);
    }
  }, [oneRM]);

  return (
    <OneRMContext.Provider value={{ oneRM, setOneRM, percentages }}>
      {children}
    </OneRMContext.Provider>
  );
};

export const useOneRM = () => useContext(OneRMContext);
