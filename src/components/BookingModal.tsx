import { CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { ContactFormData, Service, VehicleFormData } from '../types'

interface BookingModalProps {
  readonly initialServiceId: string | null
  readonly services: readonly Service[]
  readonly onClose: () => void
}

type Step = 1 | 2 | 3
type VehicleField = keyof VehicleFormData
type ContactField = keyof ContactFormData
type FormErrors = Partial<Record<'service' | VehicleField | ContactField, string>>

const emptyVehicle: VehicleFormData = {
  car: '',
  year: '',
  task: '',
}

const emptyContact: ContactFormData = {
  name: '',
  phone: '',
  preferredTime: '',
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute('hidden') && element.offsetParent !== null,
  )

export function BookingModal({ initialServiceId, services, onClose }: BookingModalProps) {
  const dialogRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const [step, setStep] = useState<Step>(1)
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId ?? '')
  const [vehicle, setVehicle] = useState<VehicleFormData>(emptyVehicle)
  const [contact, setContact] = useState<ContactFormData>(emptyContact)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [selectedServiceId, services],
  )

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return
      }

      const dialog = dialogRef.current
      if (!dialog) {
        return
      }

      const focusableElements = getFocusableElements(dialog)
      if (focusableElements.length === 0) {
        event.preventDefault()
        dialog.focus({ preventScroll: true })
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && (activeElement === firstElement || !dialog.contains(activeElement))) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      trapFocus(event)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const updateVehicle = (field: VehicleField, value: string) => {
    setVehicle((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const updateContact = (field: ContactField, value: string) => {
    setContact((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validateStep = (currentStep: Step): boolean => {
    const nextErrors: FormErrors = {}

    if (currentStep === 1 && !selectedServiceId) {
      nextErrors.service = 'Выберите услугу из списка.'
    }

    if (currentStep === 2) {
      if (!vehicle.car.trim()) {
        nextErrors.car = 'Укажите марку и модель автомобиля.'
      }

      const year = Number(vehicle.year)
      if (!vehicle.year.trim() || Number.isNaN(year) || year < 1980 || year > 2026) {
        nextErrors.year = 'Укажите год выпуска от 1980 до 2026.'
      }

      if (vehicle.task.trim().length < 8) {
        nextErrors.task = 'Коротко опишите задачу, минимум 8 символов.'
      }
    }

    if (currentStep === 3) {
      if (contact.name.trim().length < 2) {
        nextErrors.name = 'Укажите имя.'
      }

      const digits = contact.phone.replace(/\D/g, '')
      if (digits.length < 10) {
        nextErrors.phone = 'Укажите телефон для связи.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goNext = () => {
    if (validateStep(step)) {
      setStep((current) => (current < 3 ? ((current + 1) as Step) : current))
    }
  }

  const goBack = () => {
    setErrors({})
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateStep(3)) {
      return
    }

    setIsSuccess(true)
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="modal-header">
          <div>
            <p className="modal-kicker">Demo-запись</p>
            <h2 id="booking-title" ref={titleRef} tabIndex={-1}>
              Запись на обслуживание
            </h2>
          </div>
          <button className="icon-button" type="button" aria-label="Закрыть форму" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {isSuccess ? (
          <div className="success-state">
            <CheckCircle2 size={44} aria-hidden="true" />
            <h3>Заявка принята в demo-режиме</h3>
            <p>
              В реальном проекте здесь была бы отправка в CRM или менеджеру. В этом учебном
              интерфейсе данные никуда не отправляются.
            </p>
            <button className="button button-primary" type="button" onClick={onClose}>
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="steps" aria-label="Шаги формы">
              {[1, 2, 3].map((item) => (
                <span className={step === item ? 'step active' : 'step'} key={item}>
                  {item}
                </span>
              ))}
            </div>

            {step === 1 ? (
              <fieldset className="form-step">
                <legend>Выберите услугу</legend>
                <label className="field-label" htmlFor="service">
                  Услуга
                </label>
                <select
                  id="service"
                  aria-describedby={errors.service ? 'service-error' : undefined}
                  aria-invalid={errors.service ? 'true' : undefined}
                  value={selectedServiceId}
                  onChange={(event) => {
                    setSelectedServiceId(event.target.value)
                    setErrors((current) => ({ ...current, service: undefined }))
                  }}
                >
                  <option value="">Выберите из каталога</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
                {errors.service ? (
                  <p className="field-error" id="service-error" role="alert">
                    {errors.service}
                  </p>
                ) : null}
                {selectedService ? (
                  <p className="helper-text">
                    Выбрано: {selectedService.title}, {selectedService.duration}, цена от{' '}
                    {selectedService.priceFrom.toLocaleString('ru-RU')} ₽.
                  </p>
                ) : (
                  <p className="helper-text">Выбор можно изменить на следующем открытии формы.</p>
                )}
              </fieldset>
            ) : null}

            {step === 2 ? (
              <fieldset className="form-step">
                <legend>Авто и задача</legend>
                <label className="field-label" htmlFor="car">
                  Марка и модель
                </label>
                <input
                  id="car"
                  aria-describedby={errors.car ? 'car-error' : undefined}
                  aria-invalid={errors.car ? 'true' : undefined}
                  value={vehicle.car}
                  onChange={(event) => updateVehicle('car', event.target.value)}
                  placeholder="Например: Kia Rio"
                />
                {errors.car ? (
                  <p className="field-error" id="car-error" role="alert">
                    {errors.car}
                  </p>
                ) : null}

                <label className="field-label" htmlFor="year">
                  Год выпуска
                </label>
                <input
                  id="year"
                  aria-describedby={errors.year ? 'year-error' : undefined}
                  aria-invalid={errors.year ? 'true' : undefined}
                  inputMode="numeric"
                  value={vehicle.year}
                  onChange={(event) => updateVehicle('year', event.target.value)}
                  placeholder="2018"
                />
                {errors.year ? (
                  <p className="field-error" id="year-error" role="alert">
                    {errors.year}
                  </p>
                ) : null}

                <label className="field-label" htmlFor="task">
                  Комментарий
                </label>
                <textarea
                  id="task"
                  aria-describedby={errors.task ? 'task-error' : undefined}
                  aria-invalid={errors.task ? 'true' : undefined}
                  value={vehicle.task}
                  onChange={(event) => updateVehicle('task', event.target.value)}
                  placeholder="Опишите симптом или задачу"
                  rows={4}
                />
                {errors.task ? (
                  <p className="field-error" id="task-error" role="alert">
                    {errors.task}
                  </p>
                ) : null}
              </fieldset>
            ) : null}

            {step === 3 ? (
              <fieldset className="form-step">
                <legend>Контакты</legend>
                <label className="field-label" htmlFor="name">
                  Имя
                </label>
                <input
                  id="name"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={errors.name ? 'true' : undefined}
                  value={contact.name}
                  onChange={(event) => updateContact('name', event.target.value)}
                  placeholder="Как к вам обращаться"
                />
                {errors.name ? (
                  <p className="field-error" id="name-error" role="alert">
                    {errors.name}
                  </p>
                ) : null}

                <label className="field-label" htmlFor="phone">
                  Телефон
                </label>
                <input
                  id="phone"
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  aria-invalid={errors.phone ? 'true' : undefined}
                  value={contact.phone}
                  onChange={(event) => updateContact('phone', event.target.value)}
                  placeholder="Введите телефон для связи"
                />
                {errors.phone ? (
                  <p className="field-error" id="phone-error" role="alert">
                    {errors.phone}
                  </p>
                ) : null}

                <label className="field-label" htmlFor="preferredTime">
                  Удобное время или комментарий
                </label>
                <textarea
                  id="preferredTime"
                  value={contact.preferredTime}
                  onChange={(event) => updateContact('preferredTime', event.target.value)}
                  placeholder="Например: будний день после 18:00"
                  rows={3}
                />
              </fieldset>
            ) : null}

            <div className="modal-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={goBack}
                disabled={step === 1}
              >
                <ChevronLeft size={18} aria-hidden="true" />
                Назад
              </button>
              {step < 3 ? (
                <button className="button button-primary" type="button" onClick={goNext}>
                  Далее
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              ) : (
                <button className="button button-primary" type="submit">
                  Demo-отправка
                </button>
              )}
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
