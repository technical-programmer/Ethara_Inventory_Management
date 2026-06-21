import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Orders', path: '/orders', icon: ShoppingCart },
]

export const MobileNav = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-card/95 backdrop-blur-sm lg:hidden">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-forest-dark' : 'text-ink-faint'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                {item.label}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}