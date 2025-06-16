import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormulaContext } from './FormulaContext';

interface Props {
  children: React.ReactNode;
}

const DEFAULT_FORMULAS = ['lander', 'oconner', 'lombardi', 'mayhem', 'wathen', 'brzycki', 'epley'];

export function FormulaProvider({ children }: Props) {
  const [selectedFormulas, setSelectedFormulasState] = useState<string[]>(DEFAULT_FORMULAS);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('selectedFormulas');
        if (stored) {
          setSelectedFormulasState(JSON.parse(stored));
        }
      } catch {}
    })();
  }, []);

  const setSelectedFormulas = async (formulas: string[]) => {
    try {
      setSelectedFormulasState(formulas);
      await AsyncStorage.setItem('selectedFormulas', JSON.stringify(formulas));
    } catch {}
  };

  return (
    <FormulaContext.Provider value={{ selectedFormulas, setSelectedFormulas, weightUnit, setWeightUnit }}>
      {children}
    </FormulaContext.Provider>
  );
}
