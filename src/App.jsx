import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import BMIForm from './components/BMIForm'
import BMIResult from './components/BMIResult'
import Dashboard from './components/Dashboard'
import BMIHistory from './components/BMIHistory'
import Charts from './components/Charts'
import Toast from './components/Toast'
import useToast from './hooks/useToast'
import { useBMI } from './context/BMIContext'

/**
 * Root application component.
 * Wires together the form, results, dashboard, charts, and history table,
 * all backed by the BMIContext (localStorage-persisted records).
 */
export default function App() {
  const { records, addRecord, updateRecord, deleteRecord, deleteAllRecords } =
    useBMI()
  const { toasts, addToast } = useToast()

  const [editingRecord, setEditingRecord] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial load state for skeleton UI (records are already
  // synchronously available from localStorage via useLocalStorage,
  // but a brief loading state improves perceived performance and
  // demonstrates the loading pattern).
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350)
    return () => clearTimeout(timer)
  }, [])

  const handleFormSubmit = async (record) => {
    setIsSubmitting(true)
    try {
      // Simulate async operation (e.g. would be an API call in a real app)
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (editingRecord) {
        updateRecord(editingRecord.id, record)
        setLastResult({ ...editingRecord, ...record })
        setEditingRecord(null)
        addToast('Record updated successfully.', 'success')
      } else {
        const saved = addRecord(record)
        setLastResult(saved)
        addToast('BMI calculated and saved.', 'success')
      }
    } catch (err) {
      console.error(err)
      addToast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingRecord(null)
  }

  const handleDelete = (id) => {
    deleteRecord(id)
    if (lastResult?.id === id) setLastResult(null)
    addToast('Record deleted.', 'success')
  }

  const handleDeleteAll = () => {
    deleteAllRecords()
    setLastResult(null)
    addToast('All records deleted.', 'success')
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <div className="container">
          <section className="section">
            <div className="grid grid-2">
              <BMIForm
                editingRecord={editingRecord}
                onSubmit={handleFormSubmit}
                onCancelEdit={handleCancelEdit}
                isSubmitting={isSubmitting}
              />
              <BMIResult result={lastResult} />
            </div>
          </section>

          <Dashboard records={records} />

          <Charts records={records} />

          <BMIHistory
            records={records}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDeleteAll={handleDeleteAll}
            isLoading={isLoading}
          />
        </div>
      </main>

      <Toast toasts={toasts} />
    </div>
  )
}
