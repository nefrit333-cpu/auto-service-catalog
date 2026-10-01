import { serviceCategories } from '../data/services'
import type { ServiceCategory } from '../types'

interface CategoryFilterProps {
  readonly activeCategory: ServiceCategory | 'all'
  readonly onChange: (category: ServiceCategory | 'all') => void
}

export function CategoryFilter({ activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="filter-row" aria-label="Фильтр категорий услуг">
      <button
        className={activeCategory === 'all' ? 'filter-chip active' : 'filter-chip'}
        type="button"
        onClick={() => onChange('all')}
      >
        Все
      </button>
      {serviceCategories.map((category) => (
        <button
          className={activeCategory === category.id ? 'filter-chip active' : 'filter-chip'}
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
