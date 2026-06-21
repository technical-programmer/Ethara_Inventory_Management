import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Package, Search, X } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { ProductForm } from '../components/products/ProductForm'
import { StockGauge } from '../components/products/StockGauge'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'in_stock', label: 'In stock' },
  { key: 'low', label: 'Low stock' },
  { key: 'out', label: 'Out of stock' },
]

const LOW_STOCK_THRESHOLD = 10

export const ProductsPage = () => {
  const { products, isLoading, error, addProduct, editProduct, removeProduct } = useProducts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredProducts = useMemo(() => {
    let result = products

    if (activeFilter === 'in_stock') {
      result = result.filter((p) => p.quantity >= LOW_STOCK_THRESHOLD)
    } else if (activeFilter === 'low') {
      result = result.filter((p) => p.quantity > 0 && p.quantity < LOW_STOCK_THRESHOLD)
    } else if (activeFilter === 'out') {
      result = result.filter((p) => p.quantity === 0)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      )
    }

    return result
  }, [products, searchQuery, activeFilter])

  const openCreateModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleSubmit = async (productData) => {
    if (editingProduct) {
      await editProduct(editingProduct.id, productData)
      toast.success('Product updated')
    } else {
      await addProduct(productData)
      toast.success('Product added')
    }
    closeModal()
  }

  const handleDelete = async (productId, productName) => {
    const confirmed = window.confirm(`Delete "${productName}"? This cannot be undone.`)
    if (!confirmed) return
    try {
      await removeProduct(productId)
      toast.success(`"${productName}" deleted`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete product.')
    }
  }

  const hasActiveFilters = searchQuery.trim() !== '' || activeFilter !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setActiveFilter('all')
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Catalog</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Products</h2>
        </div>
        <Button onClick={openCreateModal}>Add product</Button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-clay-line bg-clay-soft px-4 py-2.5 text-sm text-clay">
          {error}
        </p>
      )}

      {!isLoading && products.length > 0 && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={15} strokeWidth={2} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or SKU…"
              className="w-full rounded-lg border border-line bg-card py-2 pl-9 pr-9 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                  activeFilter === filter.key
                    ? 'bg-forest-dark text-paper'
                    : 'bg-line-soft text-ink-soft hover:bg-line'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-line-soft" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="animate-fade-up flex flex-col items-center rounded-2xl border border-dashed border-ink-faint/40 bg-card px-6 py-16 text-center">
          <Package size={28} strokeWidth={1.5} className="mb-3 text-ink-faint" />
          <p className="text-sm font-medium text-ink">No products yet</p>
          <p className="mt-1 text-sm text-ink-faint">Add your first one to start tracking stock.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="animate-fade-up flex flex-col items-center rounded-2xl border border-dashed border-ink-faint/40 bg-card px-6 py-16 text-center">
          <Search size={24} strokeWidth={1.5} className="mb-3 text-ink-faint" />
          <p className="text-sm font-medium text-ink">No matches</p>
          <p className="mt-1 text-sm text-ink-faint">Try a different search term or filter.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-xs font-medium text-forest-dark transition-colors hover:text-ink"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-card sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper">
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">Name</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">SKU</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">Price</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">Stock</th>
                  <th className="px-5 py-3 text-right font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="animate-fade-in transition-colors duration-150 hover:bg-paper hover:shadow-[inset_0_0_0_1px_var(--color-line)]"
                    style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                  >
                    <td className="px-5 py-4 font-medium text-ink">{product.name}</td>
                    <td className="px-5 py-4 font-mono text-ink-soft">{product.sku}</td>
                    <td className="px-5 py-4 font-mono tabular-nums text-ink">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <StockGauge quantity={product.quantity} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-all duration-150 hover:border-ink-faint hover:text-ink active:scale-[0.97]"
                        >
                          <Pencil size={13} strokeWidth={1.75} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="flex items-center gap-1.5 rounded-lg border border-clay-line px-3 py-1.5 text-xs font-medium text-clay transition-all duration-150 hover:bg-clay-soft active:scale-[0.97]"
                        >
                          <Trash2 size={13} strokeWidth={1.75} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 sm:hidden">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up rounded-xl border border-line bg-card p-4 transition-shadow duration-150 active:shadow-inner"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{product.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-ink-faint">{product.sku}</p>
                  </div>
                  <p className="font-mono text-sm font-semibold tabular-nums text-ink">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                  <StockGauge quantity={product.quantity} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      aria-label="Edit product"
                      className="rounded-lg border border-line p-2 text-ink-soft transition-all duration-150 hover:border-ink-faint hover:text-ink active:scale-[0.95]"
                    >
                      <Pencil size={14} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      aria-label="Delete product"
                      className="rounded-lg border border-clay-line p-2 text-clay transition-all duration-150 hover:bg-clay-soft active:scale-[0.95]"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        eyebrow={editingProduct ? 'Edit entry' : 'New entry'}
        title={editingProduct ? 'Edit product' : 'Add product'}
      >
        <ProductForm initialData={editingProduct} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>
    </div>
  )
}