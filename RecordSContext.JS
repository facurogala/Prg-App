import React, { createContext, useContext, useState } from 'react'

const RecordsContext = createContext()

export const useRecords = () => useContext(RecordsContext)

export const RecordsProvider = ({ children }) => {
  const [records, setRecords] = useState([])

  const addRecord = (record) => {
    setRecords((prevRecords) => [...prevRecords, record])
  };

  return (
    <RecordsContext.Provider value={{ records, addRecord }}>
      {children}
    </RecordsContext.Provider>
  )
};
