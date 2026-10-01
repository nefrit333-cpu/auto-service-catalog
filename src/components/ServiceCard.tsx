import { ArrowRight, CalendarPlus, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice, serviceCategories } from '../data/services'
import type { Service } from '../types'

interface ServiceCardProps {
  readonly service: Service
  readonly onBookingClick: (serviceId: string) => void
}

export function ServiceCard({ service, onBookingClick }: ServiceCardProps) {
  const categoryLabel =
    serviceCategories.find((category) => category.id === service.category)?.label ?? 'Услуга'

  return (
    <article className="service-card">
      <div className="card-topline">
        <span className="category-badge">{categoryLabel}</span>
        <span className="duration">
          <Clock size={16} aria-hidden="true" />
          {service.duration}
        </span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.shortDescription}</p>
      <div className="service-card-footer">
        <strong>от {formatPrice(service.priceFrom)} ₽</strong>
        <div className="service-actions">
          <Link className="text-link" to={`/services/${service.slug}`}>
            Подробнее
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            className="button button-small"
            type="button"
            onClick={() => onBookingClick(service.id)}
          >
            <CalendarPlus size={16} aria-hidden="true" />
            Записаться
          </button>
        </div>
      </div>
    </article>
  )
}
