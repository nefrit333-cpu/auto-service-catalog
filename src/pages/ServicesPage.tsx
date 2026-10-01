import { useMemo, useState } from 'react'
import { CategoryFilter } from '../components/CategoryFilter'
import { ServiceCard } from '../components/ServiceCard'
import { services } from '../data/services'
import type { ServiceCategory } from '../types'

interface ServicesPageProps {
  readonly onBookingClick: (serviceId?: string) => void
}

export function ServicesPage({ onBookingClick }: ServicesPageProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all')

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') {
      return services
    }

    return services.filter((service) => service.category === activeCategory)
  }, [activeCategory])

  return (
    <section className="section page-section">
      <div className="container page-heading">
        <p className="small-label">Каталог</p>
        <h1>Услуги и цены “от”</h1>
        <p>
          Фильтр работает на клиенте, без перезагрузки страницы и без обращения к серверу.
        </p>
      </div>
      <div className="container">
        <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
      </div>
      <div className="container catalog-summary">
        Найдено услуг: <strong>{filteredServices.length}</strong>
      </div>
      <div className="container service-grid catalog-grid">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} onBookingClick={onBookingClick} />
        ))}
      </div>
    </section>
  )
}
