import { Gamepad2, Home, LogOut, Menu, Shield, Swords, Users, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'
import { OracleChatPanel } from '../../features/oracle/components/OracleChatPanel'
import { cn } from '../../shared/lib/cn'

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: Home },
  { to: '/players', label: 'Joueurs', icon: Users },
  { to: '/matches', label: 'Matchs', icon: Swords },
]

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-arena-950 text-slate-100">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-arena-900/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-neon-400" />
          <span className="font-semibold">Esport Hub</span>
        </div>
        <button
          type="button"
          aria-label="Afficher ou masquer le menu"
          className="rounded-md border border-slate-700 p-2"
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        <aside
          className={cn(
            'fixed left-0 top-14 z-20 flex h-[calc(100dvh-3.5rem)] w-64 flex-col border-r border-slate-800 bg-arena-900 p-4 transition-transform md:static md:top-auto md:h-auto md:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="mb-8 hidden items-center gap-2 md:flex">
            <Gamepad2 className="h-5 w-5 text-neon-400" />
            <span className="font-semibold">Esport Hub</span>
          </div>
          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-neon-400/20 text-neon-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-3 border-t border-slate-800 pt-4">
            {isAuthenticated && user ? (
              <>
                <div className="rounded-lg border border-slate-800 bg-arena-950 p-3">
                  <p className="text-sm font-semibold text-slate-100">{user.username}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-neon-400/50 bg-neon-400/10 px-2 py-1 text-xs font-medium text-neon-400">
                    <Shield className="h-3 w-3" />
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-200 transition hover:border-neon-400/60 hover:text-neon-300"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="rounded-md border border-slate-700 bg-arena-950 px-3 py-2 text-center text-sm text-slate-200 transition hover:border-neon-400/60 hover:text-neon-300"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-neon-400 px-3 py-2 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-10 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <main className="relative z-0 w-full min-w-0 flex-1 p-4 transition-all duration-300 md:p-8 lg:pr-80">
          <Outlet />
        </main>

        {isAuthenticated ? (
          <div
            className="pointer-events-none fixed bottom-0 right-0 top-0 z-40 hidden w-80 max-w-[100vw] border-l border-slate-800/90 bg-arena-950/40 backdrop-blur-sm lg:pointer-events-auto lg:block"
            data-ai-chat-slot
            aria-label="Espace assistant IA"
          >
            <OracleChatPanel />
          </div>
        ) : null}
      </div>
    </div>
  )
}
