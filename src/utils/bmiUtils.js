/**
 * BMI utility functions
 * Centralized logic for BMI calculation, categorization,
 * formatting, and CSV export.
 */

export const BMI_CATEGORIES = {
  UNDERWEIGHT: 'Underweight',
  NORMAL: 'Normal Weight',
  OVERWEIGHT: 'Overweight',
  OBESE: 'Obese',
}

export const CATEGORY_COLORS = {
  [BMI_CATEGORIES.UNDERWEIGHT]: '#3b82f6', // blue
  [BMI_CATEGORIES.NORMAL]: '#22c55e', // green
  [BMI_CATEGORIES.OVERWEIGHT]: '#f59e0b', // amber
  [BMI_CATEGORIES.OBESE]: '#ef4444', // red
}

/**
 * Calculate BMI given weight (kg) and height (cm)
 * BMI = weight (kg) / (height (m))^2
 * @param {number} weightKg
 * @param {number} heightCm
 * @returns {number} BMI rounded to 2 decimal places
 */
export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100
  if (!heightM || heightM <= 0) return 0
  const bmi = weightKg / (heightM * heightM)
  return Math.round(bmi * 100) / 100
}

/**
 * Determine BMI category based on standard WHO ranges
 * @param {number} bmi
 * @returns {string}
 */
export function getBMICategory(bmi) {
  if (bmi < 18.5) return BMI_CATEGORIES.UNDERWEIGHT
  if (bmi < 25) return BMI_CATEGORIES.NORMAL
  if (bmi < 30) return BMI_CATEGORIES.OVERWEIGHT
  return BMI_CATEGORIES.OBESE
}

/**
 * Get a short health tip based on BMI category
 * @param {string} category
 * @returns {string}
 */
export function getCategoryAdvice(category) {
  switch (category) {
    case BMI_CATEGORIES.UNDERWEIGHT:
      return 'You may need to gain some weight. Consult a nutritionist for a balanced diet plan.'
    case BMI_CATEGORIES.NORMAL:
      return 'Great! You have a healthy body weight. Keep maintaining a balanced lifestyle.'
    case BMI_CATEGORIES.OVERWEIGHT:
      return 'Consider regular exercise and a balanced diet to reach a healthier weight range.'
    case BMI_CATEGORIES.OBESE:
      return 'It is recommended to consult a healthcare provider for a personalized health plan.'
    default:
      return ''
  }
}

/**
 * Format a date string/timestamp into a readable format
 * @param {string|number|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Generate a unique ID (used for record IDs)
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Convert an array of BMI records to CSV string
 * @param {Array<Object>} records
 * @returns {string}
 */
export function recordsToCSV(records) {
  const headers = [
    'Name',
    'Age',
    'Gender',
    'Height (cm)',
    'Weight (kg)',
    'BMI',
    'Category',
    'Created Date',
  ]

  const rows = records.map((r) => [
    r.name,
    r.age,
    r.gender,
    r.height,
    r.weight,
    r.bmi,
    r.category,
    formatDate(r.createdAt),
  ])

  const escapeCsv = (val) => {
    const str = String(val ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\n')

  return csvContent
}

/**
 * Trigger a browser download for given content
 * @param {string} content
 * @param {string} filename
 * @param {string} mimeType
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Compute dashboard statistics from records
 * @param {Array<Object>} records
 * @returns {Object}
 */
export function computeStats(records) {
  const total = records.length
  const stats = {
    total,
    averageBMI: 0,
    underweight: 0,
    normal: 0,
    overweight: 0,
    obese: 0,
  }

  if (total === 0) return stats

  let sum = 0
  records.forEach((r) => {
    sum += Number(r.bmi) || 0
    switch (r.category) {
      case BMI_CATEGORIES.UNDERWEIGHT:
        stats.underweight += 1
        break
      case BMI_CATEGORIES.NORMAL:
        stats.normal += 1
        break
      case BMI_CATEGORIES.OVERWEIGHT:
        stats.overweight += 1
        break
      case BMI_CATEGORIES.OBESE:
        stats.obese += 1
        break
      default:
        break
    }
  })

  stats.averageBMI = Math.round((sum / total) * 100) / 100
  return stats
}

/**
 * Validate BMI form input fields
 * @param {Object} values
 * @returns {Object} errors object - empty if valid
 */
export function validateBMIForm(values) {
  const errors = {}

  if (!values.name || !values.name.trim()) {
    errors.name = 'Name is required'
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  const age = Number(values.age)
  if (!values.age) {
    errors.age = 'Age is required'
  } else if (Number.isNaN(age) || age <= 0 || age > 120) {
    errors.age = 'Enter a valid age (1-120)'
  }

  if (!values.gender) {
    errors.gender = 'Gender is required'
  }

  const height = Number(values.height)
  if (!values.height) {
    errors.height = 'Height is required'
  } else if (Number.isNaN(height) || height < 50 || height > 300) {
    errors.height = 'Enter a valid height in cm (50-300)'
  }

  const weight = Number(values.weight)
  if (!values.weight) {
    errors.weight = 'Weight is required'
  } else if (Number.isNaN(weight) || weight < 2 || weight > 500) {
    errors.weight = 'Enter a valid weight in kg (2-500)'
  }

  return errors
}
