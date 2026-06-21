import { useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Users } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { CustomerForm } from '../components/customers/CustomerForm'

export const CustomersPage = () => {
  const { customers, isLoading, error, addCustomer, removeCustomer } = useCustomers()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreate = async (customerData) => {
    await addCustomer(customerData)
    toast.success('Customer added')
    setIsModalOpen(false)
  }

  const handleDelete = async (customerId, customerName) => {
    const confirmed = window.confirm(`Delete "${customerName}"? This cannot be undone.`)
    if (!confirmed) return
    try {
      await removeCustomer(customerId)
      toast.success(`"${customerName}" deleted`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete customer.')
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Contacts</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Customers</h2>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add customer</Button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-clay-line bg-clay-soft px-4 py-2.5 text-sm text-clay">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-line-soft" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="animate-fade-up flex flex-col items-center rounded-2xl border border-dashed border-ink-faint/40 bg-card px-6 py-16 text-center">
          <Users size={28} strokeWidth={1.5} className="mb-3 text-ink-faint" />
          <p className="text-sm font-medium text-ink">No customers yet</p>
          <p className="mt-1 text-sm text-ink-faint">Add your first one to start placing orders.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-card sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper">
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">Name</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">Email</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">Phone</th>
                  <th className="px-5 py-3 text-right font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {customers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className="animate-fade-in transition-colors duration-150 hover:bg-paper hover:shadow-[inset_0_0_0_1px_var(--color-line)]"
                    style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                  >
                    <td className="px-5 py-4 font-medium text-ink">{customer.full_name}</td>
                    <td className="px-5 py-4 font-mono text-ink-soft">{customer.email}</td>
                    <td className="px-5 py-4 font-mono tabular-nums text-ink-soft">{customer.phone_number}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(customer.id, customer.full_name)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-clay-line px-3 py-1.5 text-xs font-medium text-clay transition-all duration-150 hover:bg-clay-soft active:scale-[0.97]"
                      >
                        <Trash2 size={13} strokeWidth={1.75} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 sm:hidden">
            {customers.map((customer, index) => (
              <div
                key={customer.id}
                className="animate-fade-up rounded-xl border border-line bg-card p-4"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{customer.full_name}</p>
                    <p className="mt-0.5 truncate font-mono text-xs text-ink-soft">{customer.email}</p>
                    <p className="mt-0.5 font-mono text-xs text-ink-faint">{customer.phone_number}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(customer.id, customer.full_name)}
                    aria-label="Delete customer"
                    className="rounded-lg border border-clay-line p-2 text-clay transition-all duration-150 hover:bg-clay-soft active:scale-[0.95]"
                  >
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} eyebrow="New entry" title="Add customer">
        <CustomerForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}