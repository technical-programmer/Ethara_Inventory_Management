import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Orders', path: '/orders', icon: ShoppingCart },
]

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-line lg:bg-paper">
      <div className="flex h-20 items-center gap-3 border-b border-line px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-dark font-display text-base font-semibold text-paper">
          S
        </div>
        <div>
          <h1 className="font-display text-base font-semibold leading-none tracking-tight text-ink">
            Stockroom
          </h1>
          <p className="mt-1 text-[11px] text-ink-faint">Inventory &amp; orders</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-forest-soft text-forest-dark'
                    : 'text-ink-soft hover:bg-line-soft hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-line p-5">
      </div>
    </aside>
  )
}