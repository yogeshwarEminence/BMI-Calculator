import '../styles/BMIHistory.css'

/**
 * Generic confirmation modal dialog.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.message
 * @param {Function} props.onConfirm
 * @param {Function} props.onCancel
 * @param {string} [props.confirmLabel]
 * @param {boolean} [props.danger]
 */
export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  danger = false,
}) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={onCancel}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="confirm-modal-title">{title}</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <p>{message}</p>
        <div className="form-actions mt-md">
          <button
            type="button"
            className={danger ? 'btn btn-danger' : 'btn btn-primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
