import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CategoryFilter } from '../components/CategoryFilter'
import { ServiceCard } from '../components/ServiceCard'
import { serviceCategories, services } from '../data/services'
import type { ServiceCategory } from '../types'

interface ServicesPageProps {
  readonly onBookingClick: (serviceId?: string) => void
}

const getCategoryFromSearch = (category: string | null): ServiceCategory | 'all' => {
  if (serviceCategories.some((item) => item.id === category)) {
    return category as ServiceCategory
  }

  return 'all'
}

export function ServicesPage({ onBookingClick }: ServicesPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = getCategoryFromSearch(searchParams.get('category'))

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') {
      return services
    }

    return services.filter((service) => service.category === activeCategory)
  }, [activeCategory])

  const changeCategory = (category: ServiceCategory | 'all') => {
    setSearchParams(category === 'all' ? {} : { category })
  }

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
        <CategoryFilter activeCategory={activeCategory} onChange={changeCategory} />
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
