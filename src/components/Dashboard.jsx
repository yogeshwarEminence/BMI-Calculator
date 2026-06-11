import { computeStats } from '../utils/bmiUtils'
import '../styles/Dashboard.css'

/**
 * Displays summary statistics for all BMI records.
 *
 * @param {Object} props
 * @param {Array<Object>} props.records
 */
export default function Dashboard({ records }) {
  const stats = computeStats(records)

  const cards = [
    {
      key: 'total',
      label: 'Total Records',
      value: stats.total,
      icon: '📋',
      iconClass: 'stat-icon-total',
    },
    {
      key: 'average',
      label: 'Average BMI',
      value: stats.total ? stats.averageBMI : '—',
      icon: '⚖️',
      iconClass: 'stat-icon-avg',
    },
    {
      key: 'underweight',
      label: 'Underweight',
      value: stats.underweight,
      icon: '⬇️',
      iconClass: 'stat-icon-underweight',
    },
    {
      key: 'normal',
      label: 'Normal Weight',
      value: stats.normal,
      icon: '✅',
      iconClass: 'stat-icon-normal',
    },
    {
      key: 'overweight',
      label: 'Overweight',
      value: stats.overweight,
      icon: '⚠️',
      iconClass: 'stat-icon-overweight',
    },
    {
      key: 'obese',
      label: 'Obese',
      value: stats.obese,
      icon: '🔺',
      iconClass: 'stat-icon-obese',
    },
  ]

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>Dashboard</h2>
          <p className="section-subtitle">
            Overview of all saved BMI records
          </p>
        </div>
      </div>

      <div className="grid grid-3">
        {cards.map((c) => (
          <div className="card stat-card card-hover" key={c.key}>
            <div className={`stat-icon ${c.iconClass}`} aria-hidden="true">
              {c.icon}
            </div>
            <div className="stat-content">
              <span className="stat-value">{c.value}</span>
              <span className="stat-label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
