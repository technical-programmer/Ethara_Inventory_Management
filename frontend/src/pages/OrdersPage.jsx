import { useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { useCustomers } from '../hooks/useCustomers'
import { useProducts } from '../hooks/useProducts'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { OrderForm } from '../components/orders/OrderForm'

export const OrdersPage = () => {
  const { orders, isLoading, error, addOrder, removeOrder } = useOrders()
  const { customers } = useCustomers()
  const { products, refetch: refetchProducts } = useProducts()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreate = async (orderData) => {
    await addOrder(orderData)
    toast.success('Order placed')
    setIsModalOpen(false)
    refetchProducts()
  }

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm('Delete this order? This cannot be undone.')
    if (!confirmed) return
    try {
      await removeOrder(orderId)
      toast.success('Order deleted')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete order.')
    }
  }

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId)
    return customer ? customer.full_name : `Customer #${customerId}`
  }

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.name : `Product #${productId}`
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Transactions</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Orders</h2>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add order</Button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-clay-line bg-clay-soft px-4 py-2.5 text-sm text-clay">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-line-soft" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="animate-fade-up flex flex-col items-center rounded-2xl border border-dashed border-ink-faint/40 bg-card px-6 py-16 text-center">
          <ShoppingCart size={28} strokeWidth={1.5} className="mb-3 text-ink-faint" />
          <p className="text-sm font-medium text-ink">No orders yet</p>
          <p className="mt-1 text-sm text-ink-faint">Add your first one to start tracking sales.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="animate-fade-up overflow-hidden rounded-2xl border border-line bg-card transition-shadow duration-150 hover:shadow-[0_4px_16px_-8px_rgba(26,36,33,0.18)]"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                    Order #{String(order.id).padStart(4, '0')}
                  </p>
                  <p className="mt-1 font-medium text-ink">{getCustomerName(order.customer_id)}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-faint">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-semibold text-ink">
                    ${order.total_amount.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-clay-line px-3 py-1.5 text-xs font-medium text-clay transition-all duration-150 hover:bg-clay-soft active:scale-[0.97]"
                  >
                    <Trash2 size={13} strokeWidth={1.75} />
                    Delete
                  </button>
                </div>
              </div>

              <div className="divide-y divide-line-soft px-5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2.5 text-sm">
                    <span className="text-ink-soft">
                      {getProductName(item.product_id)}{' '}
                      <span className="font-mono text-ink-faint">× {item.quantity}</span>
                    </span>
                    <span className="font-mono tabular-nums text-ink">
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2" />
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} eyebrow="New entry" title="Add order">
        <OrderForm
          customers={customers}
          products={products}
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}