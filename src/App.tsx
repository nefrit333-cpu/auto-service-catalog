import { useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { BookingModal } from './components/BookingModal'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { services } from './data/services'
import { ContactsPage } from './pages/ContactsPage'
import { HomePage } from './pages/HomePage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { ServicesPage } from './pages/ServicesPage'

function App() {
  const [bookingServiceId, setBookingServiceId] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const bookingTriggerRef = useRef<HTMLElement | null>(null)

  const openBooking = (serviceId?: string) => {
    bookingTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    setBookingServiceId(serviceId ?? null)
    setIsBookingOpen(true)
  }

  const closeBooking = () => {
    setIsBookingOpen(false)
    window.requestAnimationFrame(() => {
      if (bookingTriggerRef.current?.isConnected) {
        bookingTriggerRef.current.focus()
      }
    })
  }

  return (
    <div className="app-shell">
      <Header onBookingClick={() => openBooking()} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage onBookingClick={openBooking} />} />
          <Route path="/services" element={<ServicesPage onBookingClick={openBooking} />} />
          <Route
            path="/services/:slug"
            element={<ServiceDetailPage onBookingClick={openBooking} />}
          />
          <Route path="/contacts" element={<ContactsPage onBookingClick={() => openBooking()} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer onBookingClick={() => openBooking()} />
      {isBookingOpen ? (
        <BookingModal
          initialServiceId={bookingServiceId}
          services={services}
          onClose={closeBooking}
        />
      ) : null}
    </div>
  )
}

export default App
