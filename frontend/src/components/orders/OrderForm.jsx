import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'

const selectClass =
  'w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15'
const inputClass =
  'w-20 rounded-lg border border-line bg-card px-3 py-2.5 text-sm font-mono text-ink transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15'
const labelClass = 'mb-1.5 block text-xs font-medium text-ink-soft'

export const OrderForm = ({ customers, products, onSubmit, onCancel }) => {
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const addItemRow = () => {
    setItems((prev) => [...prev, { product_id: '', quantity: 1 }])
  }

  const removeItemRow = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    try {
      await onSubmit({
        customer_id: parseInt(customerId, 10),
        items: items.map((item) => ({
          product_id: parseInt(item.product_id, 10),
          quantity: parseInt(item.quantity, 10),
        })),
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
        <label className={labelClass}>Customer</label>
        <select
          required
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className={selectClass}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.full_name} ({customer.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Items</label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <select
                required
                value={item.product_id}
                onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                className={`flex-1 ${selectClass}`}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (${product.price.toFixed(2)}, {product.quantity} in stock)
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                required
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className={inputClass}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  className="flex items-center px-2 text-ink-faint hover:text-clay"
                  aria-label="Remove item"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItemRow}
          className="mt-2 font-mono text-xs uppercase tracking-wider text-forest-dark hover:text-ink"
        >
          + Add another product
        </button>
      </div>

      <div className="flex justify-end gap-3 border-t border-line-soft pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Placing order…' : 'Place order'}
        </Button>
      </div>
    </form>
  )
}