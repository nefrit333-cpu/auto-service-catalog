import { CalendarPlus, MapPin, MessageSquareText } from 'lucide-react'

interface ContactsPageProps {
  readonly onBookingClick: () => void
}

export function ContactsPage({ onBookingClick }: ContactsPageProps) {
  return (
    <section className="section page-section">
      <div className="container contacts-layout">
        <div className="page-heading">
          <p className="small-label">Контакты</p>
          <h1>Demo-контакты для портфолио</h1>
          <p>
            Здесь нет реальной компании и реального отдела записи. Контакты нужны, чтобы показать,
            как выглядела бы страница автосервиса в учебном проекте.
          </p>
        </div>

        <div className="contact-panel">
          <div className="contact-row">
            <MapPin size={22} aria-hidden="true" />
            <div>
              <strong>Адрес</strong>
              <span>Москва, demo-адрес для портфолио</span>
            </div>
          </div>
          <div className="contact-row">
            <MessageSquareText size={22} aria-hidden="true" />
            <div>
              <strong>Связь</strong>
              <span>Контактные данные не привязаны к реальному бизнесу.</span>
            </div>
          </div>
          <div className="contact-row">
            <CalendarPlus size={22} aria-hidden="true" />
            <div>
              <strong>Запись</strong>
              <span>Форма работает только как frontend-demo и не отправляет заявку.</span>
            </div>
          </div>
          <button className="button button-primary" type="button" onClick={onBookingClick}>
            Открыть форму записи
          </button>
        </div>
      </div>
    </section>
  )
}
