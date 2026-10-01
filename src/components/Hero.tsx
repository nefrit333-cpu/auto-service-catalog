import { ArrowRight, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/service-hero.webp'

interface HeroProps {
  readonly onBookingClick: () => void
}

export function Hero({ onBookingClick }: HeroProps) {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>Городской автосервис в Москве с понятным каталогом услуг</h1>
          <p>
            Учебный demo-сайт: услуги с ценами “от”, фильтры по категориям и запись без
            лишних звонков. Заявки остаются внутри интерфейса.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/services">
              Посмотреть услуги
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <button className="button button-secondary" type="button" onClick={onBookingClick}>
              <ClipboardList size={18} aria-hidden="true" />
              Записаться
            </button>
          </div>
        </div>
        <div className="hero-media">
          <img
            src={heroImage}
            alt="Светлый demo-цех автосервиса с автомобилем на подъёмнике"
          />
        </div>
      </div>
    </section>
  )
}
