import { Menu, Wrench, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

interface HeaderProps {
  readonly onBookingClick: () => void
}

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/services', label: 'Услуги' },
  { to: '/contacts', label: 'Контакты' },
] as const

export function Header({ onBookingClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <Wrench size={20} />
          </span>
          <span>
            <strong>Автосервис</strong>
            <small>portfolio demo</small>
          </span>
        </NavLink>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button className="button button-primary" type="button" onClick={onBookingClick}>
            Записаться
          </button>
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="mobile-nav" aria-label="Мобильная навигация">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeMenu}>
              {item.label}
            </NavLink>
          ))}
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              closeMenu()
              onBookingClick()
            }}
          >
            Записаться
          </button>
        </nav>
      ) : null}
    </header>
  )
}
