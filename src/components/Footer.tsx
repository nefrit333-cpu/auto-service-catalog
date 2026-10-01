import { Link } from 'react-router-dom'

interface FooterProps {
  readonly onBookingClick: () => void
}

export function Footer({ onBookingClick }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-title">Автосервис portfolio demo</p>
          <p>
            Учебный React-проект с каталогом услуг, фильтрами, страницами деталей и
            demo-формой записи. Заявки не отправляются на сервер.
          </p>
        </div>
        <div>
          <p className="footer-title">Разделы</p>
          <Link to="/services">Каталог услуг</Link>
          <Link to="/contacts">Контакты</Link>
        </div>
        <div>
          <p className="footer-title">Demo-запись</p>
          <button className="button button-secondary" type="button" onClick={onBookingClick}>
            Открыть форму
          </button>
        </div>
      </div>
    </footer>
  )
}
