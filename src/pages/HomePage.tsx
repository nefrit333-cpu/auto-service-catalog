import { ArrowRight, ClipboardCheck, Filter, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryFilter } from '../components/CategoryFilter'
import { Hero } from '../components/Hero'
import { ServiceCard } from '../components/ServiceCard'
import { services } from '../data/services'
import serviceToolsImage from '../assets/service-tools.webp'

interface HomePageProps {
  readonly onBookingClick: (serviceId?: string) => void
}

export function HomePage({ onBookingClick }: HomePageProps) {
  const popularServices = services.filter((service) => service.popular).slice(0, 4)

  return (
    <>
      <Hero onBookingClick={() => onBookingClick()} />

      <section className="section">
        <div className="container section-header">
          <div>
            <h2>Быстрые категории</h2>
            <p>Переходите в каталог и фильтруйте услуги без перезагрузки страницы.</p>
          </div>
          <Link className="text-link" to="/services">
            Весь каталог
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="container">
          <CategoryFilter activeCategory="all" onChange={() => undefined} />
        </div>
      </section>

      <section className="section section-muted">
        <div className="container section-header">
          <div>
            <h2>Популярные услуги</h2>
            <p>Карточки показывают категорию, цену “от”, длительность и быстрые действия.</p>
          </div>
        </div>
        <div className="container service-grid">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} onBookingClick={onBookingClick} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container process-layout">
          <div>
            <h2>Как устроена запись</h2>
            <p>
              Сценарий сделан как frontend-demo: пользователь выбирает услугу, описывает авто и
              оставляет контакты. После отправки появляется success-состояние без сетевого запроса.
            </p>
            <div className="process-list">
              <div>
                <ListChecks size={24} aria-hidden="true" />
                <strong>1. Выберите услугу</strong>
                <span>Из каталога или со страницы конкретной услуги.</span>
              </div>
              <div>
                <Filter size={24} aria-hidden="true" />
                <strong>2. Опишите автомобиль</strong>
                <span>Марка, модель, год и короткий комментарий по задаче.</span>
              </div>
              <div>
                <ClipboardCheck size={24} aria-hidden="true" />
                <strong>3. Оставьте контакты</strong>
                <span>Интерфейс покажет demo-статус без отправки на сервер.</span>
              </div>
            </div>
          </div>
          <div className="process-media">
            <img src={serviceToolsImage} alt="Demo-кадр инструментов для обслуживания автомобиля" />
          </div>
        </div>
      </section>

      <section className="section demo-band">
        <div className="container demo-band-inner">
          <div>
            <h2>Это учебный portfolio demo</h2>
            <p>
              Сайт не представляет реальную компанию. Контакты условные, заявки никуда не уходят,
              а данные нужны только для демонстрации интерфейса.
            </p>
          </div>
          <button className="button button-primary" type="button" onClick={() => onBookingClick()}>
            Открыть demo-запись
          </button>
        </div>
      </section>
    </>
  )
}
