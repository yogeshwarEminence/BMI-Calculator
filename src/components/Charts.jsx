import { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import { BMI_CATEGORIES, CATEGORY_COLORS, formatDate } from '../utils/bmiUtils'
import '../styles/Charts.css'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
)

/**
 * Renders two charts:
 * 1. Doughnut chart - BMI category distribution
 * 2. Line chart - BMI trend over time (most recent 15 records)
 *
 * @param {Object} props
 * @param {Array<Object>} props.records
 */
export default function Charts({ records }) {
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'dark'

  const textColor = isDark ? '#94a3b8' : '#475569'
  const gridColor = isDark ? '#243049' : '#e2e8f0'

  const distributionData = useMemo(() => {
    const counts = {
      [BMI_CATEGORIES.UNDERWEIGHT]: 0,
      [BMI_CATEGORIES.NORMAL]: 0,
      [BMI_CATEGORIES.OVERWEIGHT]: 0,
      [BMI_CATEGORIES.OBESE]: 0,
    }
    records.forEach((r) => {
      if (counts[r.category] !== undefined) counts[r.category] += 1
    })

    const labels = Object.keys(counts)
    return {
      labels,
      datasets: [
        {
          data: labels.map((l) => counts[l]),
          backgroundColor: labels.map((l) => CATEGORY_COLORS[l]),
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }
  }, [records])

  const trendData = useMemo(() => {
    // Sort chronologically (oldest -> newest), take last 15
    const sorted = [...records]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-15)

    return {
      labels: sorted.map((r) =>
        formatDate(r.createdAt).split(',')[0] // just date portion
      ),
      datasets: [
        {
          label: 'BMI',
          data: sorted.map((r) => r.bmi),
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.15)',
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#0d9488',
        },
      ],
    }
  }, [records])

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} record(s)`,
        },
      },
    },
    cutout: '65%',
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: textColor, maxRotation: 0 },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
        suggestedMin: 10,
        suggestedMax: 40,
      },
    },
  }

  const hasData = records.length > 0

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>Analytics</h2>
          <p className="section-subtitle">
            Visualize category distribution and BMI trends
          </p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card chart-card">
          <h3 className="card-title">BMI Category Distribution</h3>
          {hasData ? (
            <>
              <div className="chart-wrapper">
                <Doughnut data={distributionData} options={doughnutOptions} />
              </div>
              <div className="chart-legend">
                {Object.entries(CATEGORY_COLORS).map(([label, color]) => (
                  <span className="chart-legend-item" key={label}>
                    <span
                      className="chart-legend-dot"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h3>No data to display</h3>
              <p>Add a BMI record to see the distribution chart.</p>
            </div>
          )}
        </div>

        <div className="card chart-card">
          <h3 className="card-title">BMI Trend (last 15 entries)</h3>
          {hasData ? (
            <div className="chart-wrapper">
              <Line data={trendData} options={lineOptions} />
            </div>
          ) : (
            <div className="empty-state">
              <h3>No data to display</h3>
              <p>Add a BMI record to see your trend over time.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
