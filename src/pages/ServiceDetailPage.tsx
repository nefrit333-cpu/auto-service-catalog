import { ArrowLeft, CalendarPlus, Clock, WalletCards } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { formatPrice, getServiceBySlug, serviceCategories } from '../data/services'

interface ServiceDetailPageProps {
  readonly onBookingClick: (serviceId?: string) => void
}

export function ServiceDetailPage({ onBookingClick }: ServiceDetailPageProps) {
  const { slug } = useParams()
  const service = slug ? getServiceBySlug(slug) : undefined

  if (!service) {
    return (
      <section className="section page-section">
        <div className="container page-heading">
          <h1>Услуга не найдена</h1>
          <p>Проверьте адрес или вернитесь в каталог.</p>
          <Link className="button button-secondary" to="/services">
            <ArrowLeft size={18} aria-hidden="true" />
            В каталог
          </Link>
        </div>
      </section>
    )
  }

  const categoryLabel =
    serviceCategories.find((category) => category.id === service.category)?.label ?? 'Услуга'

  return (
    <section className="section page-section">
      <div className="container detail-layout">
        <article className="detail-main">
          <Link className="text-link back-link" to="/services">
            <ArrowLeft size={16} aria-hidden="true" />
            Назад в каталог
          </Link>
          <span className="category-badge">{categoryLabel}</span>
          <h1>{service.title}</h1>
          <p>{service.description}</p>

          <div className="detail-facts">
            <span>
              <WalletCards size={18} aria-hidden="true" />
              от {formatPrice(service.priceFrom)} ₽
            </span>
            <span>
              <Clock size={18} aria-hidden="true" />
              {service.duration}
            </span>
          </div>

          <div className="detail-columns">
            <div>
              <h2>Что входит</h2>
              <ul className="check-list">
                {service.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Что важно уточнить</h2>
              <ul className="check-list">
                {service.clarifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <aside className="detail-aside">
          <h2>Запись на эту услугу</h2>
          <p>
            Форма откроется с уже выбранной услугой. Вы сможете изменить выбор на первом шаге.
          </p>
          <button className="button button-primary" type="button" onClick={() => onBookingClick(service.id)}>
            <CalendarPlus size={18} aria-hidden="true" />
            Записаться
          </button>
          <p className="demo-note">Demo-режим: данные не отправляются на сервер.</p>
        </aside>
      </div>
    </section>
  )
}
