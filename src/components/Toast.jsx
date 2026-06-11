/**
 * Renders a stack of toast notifications.
 *
 * @param {Object} props
 * @param {Array<{id: string, type: string, message: string}>} props.toasts
 */
export default function Toast({ toasts }) {
  if (!toasts.length) return null

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} role="status">
          {t.message}
        </div>
      ))}
    </div>
  )
}
