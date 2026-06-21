import { useState } from 'react'
import { Button } from '../ui/Button'

const EMPTY_FORM = { full_name: '', email: '', phone_number: '' }

const inputClass =
  'w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15'
const labelClass = 'mb-1.5 block text-xs font-medium text-ink-soft'

export const CustomerForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <p className="rounded-lg border border-clay-line bg-clay-soft px-3 py-2 text-sm text-clay">
          {formError}
        </p>
      )}

      <div>
        <label className={labelClass}>Full name</label>
        <input
          type="text"
          required
          value={formData.full_name}
          onChange={handleChange('full_name')}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={handleChange('email')}
          className={`${inputClass} font-mono`}
        />
      </div>

      <div>
        <label className={labelClass}>Phone number</label>
        <input
          type="tel"
          required
          value={formData.phone_number}
          onChange={handleChange('phone_number')}
          className={`${inputClass} font-mono`}
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-line-soft pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save customer'}
        </Button>
      </div>
    </form>
  )
}