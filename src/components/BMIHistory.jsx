import { useState, useMemo } from 'react'
import {
  BMI_CATEGORIES,
  formatDate,
  recordsToCSV,
  downloadFile,
} from '../utils/bmiUtils'
import ConfirmModal from './ConfirmModal'
import '../styles/BMIHistory.css'

const CATEGORY_BADGE_CLASS = {
  [BMI_CATEGORIES.UNDERWEIGHT]: 'badge-underweight',
  [BMI_CATEGORIES.NORMAL]: 'badge-normal',
  [BMI_CATEGORIES.OVERWEIGHT]: 'badge-overweight',
  [BMI_CATEGORIES.OBESE]: 'badge-obese',
}

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date (Newest first)' },
  { value: 'date-asc', label: 'Date (Oldest first)' },
  { value: 'bmi-desc', label: 'BMI (High to Low)' },
  { value: 'bmi-asc', label: 'BMI (Low to High)' },
]

/**
 * Displays BMI record history with search, filter, sort,
 * edit/delete actions, and export functionality.
 *
 * @param {Object} props
 * @param {Array<Object>} props.records
 * @param {Function} props.onEdit - called with record to edit
 * @param {Function} props.onDelete - called with record id to delete
 * @param {Function} props.onDeleteAll
 * @param {boolean} props.isLoading
 */
export default function BMIHistory({
  records,
  onEdit,
  onDelete,
  onDeleteAll,
  isLoading,
}) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState('date-desc')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)

  const filteredRecords = useMemo(() => {
    let result = [...records]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((r) => r.name.toLowerCase().includes(q))
    }

    if (categoryFilter !== 'All') {
      result = result.filter((r) => r.category === categoryFilter)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'bmi-desc':
          return b.bmi - a.bmi
        case 'bmi-asc':
          return a.bmi - b.bmi
        case 'date-desc':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return result
  }, [records, search, categoryFilter, sortBy])

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return
    const csv = recordsToCSV(filteredRecords)
    downloadFile(csv, `bmi-records-${Date.now()}.csv`, 'text/csv;charset=utf-8;')
  }

  const handleExportPDF = async () => {
    if (filteredRecords.length === 0) return

    // Dynamically import to keep initial bundle small
    const { default: jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text('BMI Report', 14, 16)
    doc.setFontSize(10)
    doc.setTextColor(120)
    doc.text(`Generated: ${formatDate(new Date())}`, 14, 22)

    autoTable(doc, {
      startY: 28,
      head: [
        [
          'Name',
          'Age',
          'Gender',
          'Height (cm)',
          'Weight (kg)',
          'BMI',
          'Category',
          'Date',
        ],
      ],
      body: filteredRecords.map((r) => [
        r.name,
        r.age,
        r.gender,
        r.height,
        r.weight,
        r.bmi,
        r.category,
        formatDate(r.createdAt),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [13, 148, 136] },
    })

    doc.save(`bmi-report-${Date.now()}.pdf`)
  }

  const handleSort = (column) => {
    if (column === 'date') {
      setSortBy((prev) => (prev === 'date-desc' ? 'date-asc' : 'date-desc'))
    } else if (column === 'bmi') {
      setSortBy((prev) => (prev === 'bmi-desc' ? 'bmi-asc' : 'bmi-desc'))
    }
  }

  const sortIndicator = (column) => {
    if (column === 'date') {
      if (sortBy === 'date-desc') return '▼'
      if (sortBy === 'date-asc') return '▲'
    }
    if (column === 'bmi') {
      if (sortBy === 'bmi-desc') return '▼'
      if (sortBy === 'bmi-asc') return '▲'
    }
    return ''
  }

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>BMI History</h2>
          <p className="section-subtitle">
            {records.length} total record{records.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="export-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            disabled={filteredRecords.length === 0}
          >
            ⬇ Export CSV
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleExportPDF}
            disabled={filteredRecords.length === 0}
          >
            ⬇ Export PDF
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => setConfirmDeleteAll(true)}
            disabled={records.length === 0}
          >
            🗑 Delete All
          </button>
        </div>
      </div>

      <div className="card">
        <div className="history-toolbar">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              className="form-control"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search by name"
            />
          </div>

          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {Object.values(BMI_CATEGORIES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort records"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="grid" style={{ gap: '0.5rem' }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: '40px' }}
              />
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="empty-state">
            <h3>No records found</h3>
            <p>
              {records.length === 0
                ? 'Start by calculating your BMI using the form above.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="history-table-wrapper scroll-x">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Height (cm)</th>
                  <th>Weight (kg)</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('bmi')}
                    title="Sort by BMI"
                  >
                    BMI <span className="sort-icon">{sortIndicator('bmi')}</span>
                  </th>
                  <th>Category</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort('date')}
                    title="Sort by date"
                  >
                    Created Date{' '}
                    <span className="sort-icon">{sortIndicator('date')}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.age}</td>
                    <td>{r.gender}</td>
                    <td>{r.height}</td>
                    <td>{r.weight}</td>
                    <td>
                      <strong>{r.bmi}</strong>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          CATEGORY_BADGE_CLASS[r.category] || ''
                        }`}
                      >
                        {r.category}
                      </span>
                    </td>
                    <td>{formatDate(r.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon"
                          onClick={() => onEdit(r)}
                          aria-label={`Edit record for ${r.name}`}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon"
                          onClick={() => setConfirmDeleteId(r.id)}
                          aria-label={`Delete record for ${r.name}`}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <ConfirmModal
          title="Delete Record"
          message="Are you sure you want to delete this BMI record? This action cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            onDelete(confirmDeleteId)
            setConfirmDeleteId(null)
          }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}

      {confirmDeleteAll && (
        <ConfirmModal
          title="Delete All Records"
          message={`Are you sure you want to delete all ${records.length} record(s)? This action cannot be undone.`}
          confirmLabel="Delete All"
          danger
          onConfirm={() => {
            onDeleteAll()
            setConfirmDeleteAll(false)
          }}
          onCancel={() => setConfirmDeleteAll(false)}
        />
      )}
    </section>
  )
}
