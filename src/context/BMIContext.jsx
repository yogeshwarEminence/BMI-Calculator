import { createContext, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { generateId } from '../utils/bmiUtils'

const BMIContext = createContext(undefined)

const STORAGE_KEY = 'bmi_records'

export function BMIProvider({ children }) {
  const [records, setRecords] = useLocalStorage(STORAGE_KEY, [])

  const addRecord = (record) => {
    const newRecord = {
      ...record,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setRecords((prev) => [newRecord, ...prev])
    return newRecord
  }

  const updateRecord = (id, updates) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...updates, updatedAt: new Date().toISOString() }
          : r
      )
    )
  }

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const deleteAllRecords = () => {
    setRecords([])
  }

  const value = useMemo(
    () => ({
      records,
      addRecord,
      updateRecord,
      deleteRecord,
      deleteAllRecords,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records]
  )

  return <BMIContext.Provider value={value}>{children}</BMIContext.Provider>
}

export function useBMI() {
  const context = useContext(BMIContext)
  if (context === undefined) {
    throw new Error('useBMI must be used within a BMIProvider')
  }
  return context
}
