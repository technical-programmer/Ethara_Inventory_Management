import { useEffect } from 'react'
import { X } from 'lucide-react'

export const Modal = ({ isOpen, onClose, title, eyebrow, children }) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-end justify-center bg-ink/45 backdrop-blur-[3px] sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-line bg-card shadow-[0_20px_60px_-15px_rgba(26,36,33,0.3)] sm:max-w-md sm:rounded-2xl"
      >
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            {eyebrow && (
              <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {eyebrow}
              </p>
            )}
            <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-faint transition-colors duration-150 hover:bg-line-soft hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}