import { BMI_CATEGORIES, getCategoryAdvice } from '../utils/bmiUtils'
import '../styles/BMIResult.css'

const CATEGORY_BADGE_CLASS = {
  [BMI_CATEGORIES.UNDERWEIGHT]: 'badge-underweight',
  [BMI_CATEGORIES.NORMAL]: 'badge-normal',
  [BMI_CATEGORIES.OVERWEIGHT]: 'badge-overweight',
  [BMI_CATEGORIES.OBESE]: 'badge-obese',
}

// BMI scale used to position the marker on the gradient bar.
// Scale capped at 40 for visualization purposes.
const SCALE_MIN = 10
const SCALE_MAX = 40

/**
 * Displays the most recently calculated BMI result with
 * a visual gauge, category badge, and health advice.
 *
 * @param {Object} props
 * @param {Object|null} props.result - { name, bmi, category, height, weight, age, gender }
 */
export default function BMIResult({ result }) {
  if (!result) {
    return (
      <div className="card result-card">
        <h2 className="card-title">Your Result</h2>
        <div className="result-empty">
          <span className="result-empty-icon" aria-hidden="true">
            🧮
          </span>
          <h3>No result yet</h3>
          <p>Fill out the form to calculate your BMI.</p>
        </div>
      </div>
    )
  }

  const { name, bmi, category, height, weight } = result

  const clamped = Math.min(Math.max(bmi, SCALE_MIN), SCALE_MAX)
  const markerPosition =
    ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100

  return (
    <div className="card result-card">
      <h2 className="card-title">Result for {name}</h2>

      <div className="result-gauge">
        <span className="result-bmi-value">{bmi}</span>
        <span className="result-bmi-label">Your BMI</span>

        <span className={`badge ${CATEGORY_BADGE_CLASS[category] || ''}`}>
          {category}
        </span>

        <div className="result-bar" aria-hidden="true">
          <div
            className="result-bar-marker"
            style={{ left: `${markerPosition}%` }}
          />
        </div>
        <div className="result-bar-scale" aria-hidden="true">
          <span>10</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40+</span>
        </div>
      </div>

      <div className="result-summary">
        <div className="result-summary-item">
          <div className="result-summary-label">Height</div>
          <div className="result-summary-value">{height} cm</div>
        </div>
        <div className="result-summary-item">
          <div className="result-summary-label">Weight</div>
          <div className="result-summary-value">{weight} kg</div>
        </div>
      </div>

      <div className="result-advice">{getCategoryAdvice(category)}</div>
    </div>
  )
}
