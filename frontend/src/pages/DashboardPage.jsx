import { useMemo } from 'react'
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCustomers } from '../hooks/useCustomers'
import { useOrders } from '../hooks/useOrders'
import { RevenueChart } from '../components/dashboard/RevenueChart'

const LOW_STOCK_THRESHOLD = 10

const STAT_ACCENTS = {
  forest: { bg: 'bg-forest-soft', text: 'text-forest-dark' },
  clay: { bg: 'bg-clay-soft', text: 'text-clay' },
  amber: { bg: 'bg-amber-soft', text: 'text-amber' },
}

const StatCard = ({ icon: Icon, label, value, accent = 'forest', delay = 0 }) => {
  const { bg, text } = STAT_ACCENTS[accent]
  return (
    <div
      className="animate-fade-up rounded-2xl border border-line bg-card p-5 transition-shadow duration-150 hover:shadow-[0_4px_16px_-8px_rgba(26,36,33,0.14)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
          <Icon size={15} strokeWidth={1.75} className={text} />
        </div>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  )
}

const StockGauge = ({ quantity, capacity = LOW_STOCK_THRESHOLD * 4 }) => {
  const pct = Math.min(100, Math.round((quantity / capacity) * 100))
  const isOut = quantity === 0
  const fillColorClass = isOut ? 'bg-clay' : 'bg-amber'

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-line-soft">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${fillColorClass}`}
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums text-ink-soft">{quantity}</span>
    </div>
  )
}

export const DashboardPage = () => {
  const { products, isLoading: productsLoading } = useProducts()
  const { customers, isLoading: customersLoading } = useCustomers()
  const { orders, isLoading: ordersLoading } = useOrders()

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.quantity < LOW_STOCK_THRESHOLD),
    [products]
  )

  const isLoading = productsLoading || customersLoading || ordersLoading

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Overview</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-line-soft" />
          ))}
        </div>
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-line-soft" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Overview</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Dashboard</h2>
        <p className="mt-1 text-sm text-ink-soft">A running summary of stock, customers and orders</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total products" value={products.length} accent="forest" delay={0} />
        <StatCard icon={Users} label="Total customers" value={customers.length} accent="forest" delay={40} />
        <StatCard icon={ShoppingCart} label="Total orders" value={orders.length} accent="forest" delay={80} />
        <StatCard
          icon={AlertTriangle}
          label="Low stock items"
          value={lowStockProducts.length}
          accent={lowStockProducts.length > 0 ? 'clay' : 'forest'}
          delay={120}
        />
      </div>

      <div className="animate-fade-up mt-6" style={{ animationDelay: '160ms' }}>
        <RevenueChart orders={orders} />
      </div>

      <div
        className="animate-fade-up mt-6 overflow-hidden rounded-2xl border border-line bg-card"
        style={{ animationDelay: '200ms' }}
      >
        <div className="border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-base font-semibold text-ink">Low stock products</h3>
          <p className="mt-0.5 text-sm text-ink-soft">
            Products with fewer than {LOW_STOCK_THRESHOLD} units remaining
          </p>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <Package size={24} strokeWidth={1.5} className="mb-2 text-ink-faint" />
            <p className="text-sm text-ink-faint">All products are well stocked.</p>
          </div>
        ) : (
          <div className="divide-y divide-line-soft">
            {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 px-5 py-4 transition-colors duration-150 hover:bg-paper"
                >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                  <p className="font-mono text-xs text-ink-faint">SKU {product.sku}</p>
                </div>
                <StockGauge quantity={product.quantity} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}