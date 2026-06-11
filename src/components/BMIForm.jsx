import { useState, useEffect } from 'react'
import {
  calculateBMI,
  getBMICategory,
  validateBMIForm,
} from '../utils/bmiUtils'
import '../styles/BMIForm.css'

const EMPTY_FORM = {
  name: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
}

/**
 * Form for creating or editing a BMI record.
 *
 * @param {Object} props
 * @param {Object|null} props.editingRecord - record currently being edited (or null)
 * @param {Function} props.onSubmit - called with (formValues, computedResult)
 * @param {Function} props.onCancelEdit - called to cancel editing mode
 * @param {boolean} props.isSubmitting - loading state for submit button
 */
export default function BMIForm({
  editingRecord,
  onSubmit,
  onCancelEdit,
  isSubmitting,
}) {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Populate form when an edit is requested
  useEffect(() => {
    if (editingRecord) {
      setValues({
        name: editingRecord.name,
        age: String(editingRecord.age),
        gender: editingRecord.gender,
        height: String(editingRecord.height),
        weight: String(editingRecord.weight),
      })
      setErrors({})
    }
  }, [editingRecord])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear field error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleGenderSelect = (gender) => {
    setValues((prev) => ({ ...prev, gender }))
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: undefined }))
    }
  }

  const resetForm = () => {
    setValues(EMPTY_FORM)
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validateBMIForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const height = Number(values.height)
    const weight = Number(values.weight)
    const bmi = calculateBMI(weight, height)
    const category = getBMICategory(bmi)

    const record = {
      name: values.name.trim(),
      age: Number(values.age),
      gender: values.gender,
      height,
      weight,
      bmi,
      category,
    }

    onSubmit(record)

    if (!editingRecord) {
      resetForm()
    }
  }

  const handleCancel = () => {
    resetForm()
    onCancelEdit()
  }

  return (
    <div className="card">
      <div className="form-card-header">
        <h2>{editingRecord ? 'Edit BMI Record' : 'Calculate Your BMI'}</h2>
      </div>

      {editingRecord && (
        <div className="editing-banner">
          <span>Editing record for {editingRecord.name}</span>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group form-group--full">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-control ${errors.name ? 'has-error' : ''}`}
              placeholder="e.g. Jane Doe"
              value={values.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <span className="form-error" id="name-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="age">
              Age (years)
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              max="120"
              className={`form-control ${errors.age ? 'has-error' : ''}`}
              placeholder="e.g. 28"
              value={values.age}
              onChange={handleChange}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? 'age-error' : undefined}
            />
            {errors.age && (
              <span className="form-error" id="age-error" role="alert">
                {errors.age}
              </span>
            )}
          </div>

          <div className="form-group">
            <span className="form-label">Gender</span>
            <div className="radio-group" role="radiogroup" aria-label="Gender">
              {['Male', 'Female', 'Other'].map((g) => (
                <label
                  key={g}
                  className={`radio-pill ${
                    values.gender === g ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={values.gender === g}
                    onChange={() => handleGenderSelect(g)}
                  />
                  {g}
                </label>
              ))}
            </div>
            {errors.gender && (
              <span className="form-error" role="alert">
                {errors.gender}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="height">
              Height (cm)
            </label>
            <input
              id="height"
              name="height"
              type="number"
              min="50"
              max="300"
              step="0.1"
              className={`form-control ${errors.height ? 'has-error' : ''}`}
              placeholder="e.g. 170"
              value={values.height}
              onChange={handleChange}
              aria-invalid={!!errors.height}
              aria-describedby={errors.height ? 'height-error' : undefined}
            />
            {errors.height && (
              <span className="form-error" id="height-error" role="alert">
                {errors.height}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="weight">
              Weight (kg)
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              min="2"
              max="500"
              step="0.1"
              className={`form-control ${errors.weight ? 'has-error' : ''}`}
              placeholder="e.g. 65"
              value={values.weight}
              onChange={handleChange}
              aria-invalid={!!errors.weight}
              aria-describedby={errors.weight ? 'weight-error' : undefined}
            />
            {errors.weight && (
              <span className="form-error" id="weight-error" role="alert">
                {errors.weight}
              </span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting && <span className="spinner" aria-hidden="true" />}
            {editingRecord ? 'Update Record' : 'Calculate & Save'}
          </button>
          {!editingRecord && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
