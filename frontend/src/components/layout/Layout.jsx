import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export const Layout = () => {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-line bg-paper px-5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-dark font-display text-sm font-semibold text-paper">
            S
          </div>
          <span className="font-display text-base font-semibold text-ink">Stockroom</span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-5 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pb-10 lg:pt-10">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}