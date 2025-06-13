import { createContext, useContext } from 'react';

type FormulaContextType = {
  selectedFormulas: string[];
  setSelectedFormulas: (formulas: string[]) => void;
  weightUnit: 'kg' | 'lbs';
  setWeightUnit: (unit: 'kg' | 'lbs') => void;
};

export const FormulaContext = createContext<FormulaContextType>({
  selectedFormulas: [],
  setSelectedFormulas: () => {},
  weightUnit: 'kg',
  setWeightUnit: () => {},
});

export const useFormulas = () => useContext(FormulaContext);