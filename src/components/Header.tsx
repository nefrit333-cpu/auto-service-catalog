import { ChevronRight, Menu, Wrench, X } from 'lucide-react'
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
            <NavLink
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
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
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="mobile-nav-wrap">
          <nav className="mobile-nav" id="mobile-menu" aria-label="Мобильная навигация">
            <div className="mobile-nav-note">
              <strong>Быстрый доступ</strong>
              <span>Каталог, контакты и demo-запись без лишних переходов.</span>
            </div>
            <div className="mobile-nav-links">
              {navItems.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
                  }
                  end={item.to === '/'}
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="mobile-nav-link-icon" size={18} aria-hidden="true" />
                </NavLink>
              ))}
            </div>
            <div className="mobile-nav-footer">
              <span>Учебный demo-проект</span>
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
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
