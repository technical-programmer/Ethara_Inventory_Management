import { useState } from 'react'
import { Button } from '../ui/Button'

const EMPTY_FORM = { name: '', sku: '', price: '', quantity: '' }

const inputClass =
  'w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15'
const labelClass = 'mb-1.5 block text-xs font-medium text-ink-soft'

export const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData
      ? {
          name: initialData.name,
          sku: initialData.sku,
          price: initialData.price,
          quantity: initialData.quantity,
        }
      : EMPTY_FORM
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const isEditMode = Boolean(initialData)

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    try {
      await onSubmit({
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      })
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
        <label className={labelClass}>Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={handleChange('name')}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>SKU</label>
        <input
          type="text"
          required
          value={formData.sku}
          onChange={handleChange('sku')}
          className={`${inputClass} font-mono`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={formData.price}
            onChange={handleChange('price')}
            className={`${inputClass} font-mono`}
          />
        </div>
        <div>
          <label className={labelClass}>Quantity</label>
          <input
            type="number"
            min="0"
            required
            value={formData.quantity}
            onChange={handleChange('quantity')}
            className={`${inputClass} font-mono`}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-line-soft pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEditMode ? 'Update product' : 'Save product'}
        </Button>
      </div>
    </form>
  )
}