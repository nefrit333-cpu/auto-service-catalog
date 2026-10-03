type Step = 1 | 2 | 3
type ErrorField = 'service' | 'car' | 'year' | 'task' | 'name' | 'phone'

const basePath = import.meta.env.BASE_URL
const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price)

const redirectHashRoute = () => {
  const { hash } = window.location

  if (!hash.startsWith('#/')) {
    return
  }

  const rawRoute = hash.slice(1)
  const [pathPart, query = ''] = rawRoute.split('?')
  const cleanedPath = pathPart.replace(/^\/+/, '').replace(/\/?$/, '/')
  const nextPathname = cleanedPath === '/' ? normalizedBasePath : `${normalizedBasePath}${cleanedPath}`
  const nextUrl = new URL(window.location.href)

  nextUrl.hash = ''
  nextUrl.search = query ? `?${query}` : ''
  nextUrl.pathname = nextPathname.replace(/\/{2,}/g, '/')
  window.location.replace(nextUrl.toString())
}

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hidden && element.offsetParent !== null,
  )

const initMobileMenu = () => {
  const button = document.querySelector<HTMLButtonElement>('[data-mobile-menu-button]')
  const wrap = document.querySelector<HTMLElement>('[data-mobile-menu-wrap]')

  if (!button || !wrap) {
    return
  }

  const setOpen = (isOpen: boolean) => {
    button.setAttribute('aria-expanded', String(isOpen))
    button.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню')
    wrap.hidden = !isOpen
  }

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true')
  })

  document.querySelectorAll('[data-mobile-menu-link], [data-mobile-menu-close]').forEach((item) => {
    item.addEventListener('click', () => setOpen(false))
  })
}

const initCatalogFilter = () => {
  const filter = document.querySelector<HTMLElement>('[data-category-filter="catalog"]')
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-service-card]'))
  const count = document.querySelector<HTMLElement>('[data-catalog-count]')

  if (!filter || cards.length === 0 || !count) {
    return
  }

  const chips = Array.from(filter.querySelectorAll<HTMLAnchorElement>('[data-filter-category]'))
  const validCategories = new Set(chips.map((chip) => chip.dataset.filterCategory).filter(Boolean))

  const applyCategory = (categoryFromUrl: string | null) => {
    const category = categoryFromUrl && validCategories.has(categoryFromUrl) ? categoryFromUrl : 'all'
    let visibleCount = 0

    chips.forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.filterCategory === category)
    })

    cards.forEach((card) => {
      const isVisible = category === 'all' || card.dataset.category === category
      card.hidden = !isVisible

      if (isVisible) {
        visibleCount += 1
      }
    })

    count.textContent = String(visibleCount)
  }

  const currentParams = new URLSearchParams(window.location.search)
  applyCategory(currentParams.get('category'))

  chips.forEach((chip) => {
    chip.addEventListener('click', (event) => {
      event.preventDefault()

      const category = chip.dataset.filterCategory ?? 'all'
      const nextUrl = new URL(window.location.href)

      if (category === 'all') {
        nextUrl.searchParams.delete('category')
      } else {
        nextUrl.searchParams.set('category', category)
      }

      history.pushState(null, '', nextUrl)
      applyCategory(category)
    })
  })

  window.addEventListener('popstate', () => {
    applyCategory(new URLSearchParams(window.location.search).get('category'))
  })
}

const initBookingModal = () => {
  const backdrop = document.querySelector<HTMLElement>('[data-booking-backdrop]')
  const modal = document.querySelector<HTMLElement>('[data-booking-modal]')
  const title = document.querySelector<HTMLElement>('[data-booking-title]')
  const form = document.querySelector<HTMLFormElement>('[data-booking-form]')
  const success = document.querySelector<HTMLElement>('[data-booking-success]')
  const serviceSelect = document.querySelector<HTMLSelectElement>('[data-booking-service]')
  const selectedService = document.querySelector<HTMLElement>('[data-booking-selected-service]')
  const backButton = document.querySelector<HTMLButtonElement>('[data-booking-back]')
  const nextButton = document.querySelector<HTMLButtonElement>('[data-booking-next]')
  const submitButton = document.querySelector<HTMLButtonElement>('[data-booking-submit]')

  if (
    !backdrop ||
    !modal ||
    !title ||
    !form ||
    !success ||
    !serviceSelect ||
    !selectedService ||
    !backButton ||
    !nextButton ||
    !submitButton
  ) {
    return
  }

  let step: Step = 1
  let lastActiveElement: HTMLElement | null = null

  const clearErrors = () => {
    document.querySelectorAll<HTMLElement>('[data-error-for]').forEach((error) => {
      error.textContent = ''
      error.hidden = true
    })

    form.querySelectorAll<HTMLElement>('[aria-invalid]').forEach((field) => {
      field.removeAttribute('aria-invalid')
      field.removeAttribute('aria-describedby')
    })
  }

  const setError = (fieldName: ErrorField, message: string) => {
    const field = form.elements.namedItem(fieldName)
    const error = form.querySelector<HTMLElement>(`[data-error-for="${fieldName}"]`)

    if (!(field instanceof HTMLElement) || !error) {
      return
    }

    error.textContent = message
    error.hidden = false
    field.setAttribute('aria-invalid', 'true')
    field.setAttribute('aria-describedby', error.id)
  }

  const getFieldValue = (fieldName: string) => {
    const field = form.elements.namedItem(fieldName)
    return field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
      ? field.value
      : ''
  }

  const updateSelectedServiceText = () => {
    const option = serviceSelect.selectedOptions[0]

    if (!serviceSelect.value || !option) {
      selectedService.textContent = 'Выбор можно изменить на следующем открытии формы.'
      return
    }

    const price = Number(option.dataset.price)
    selectedService.textContent = `Выбрано: ${option.textContent ?? ''}, ${
      option.dataset.duration ?? ''
    }, цена от ${formatPrice(price)} ₽.`
  }

  const updateStep = (nextStep: Step) => {
    step = nextStep
    clearErrors()

    document.querySelectorAll<HTMLElement>('[data-booking-step]').forEach((item) => {
      item.hidden = item.dataset.bookingStep !== String(step)
    })

    document.querySelectorAll<HTMLElement>('[data-booking-step-indicator]').forEach((item) => {
      item.classList.toggle('active', item.dataset.bookingStepIndicator === String(step))
    })

    backButton.disabled = step === 1
    nextButton.hidden = step === 3
    submitButton.hidden = step !== 3
  }

  const validateStep = (currentStep: Step) => {
    clearErrors()
    let isValid = true

    if (currentStep === 1 && !serviceSelect.value) {
      setError('service', 'Выберите услугу из списка.')
      isValid = false
    }

    if (currentStep === 2) {
      const car = getFieldValue('car').trim()
      const yearValue = getFieldValue('year').trim()
      const year = Number(yearValue)
      const task = getFieldValue('task').trim()

      if (!car) {
        setError('car', 'Укажите марку и модель автомобиля.')
        isValid = false
      }

      if (!yearValue || Number.isNaN(year) || year < 1980 || year > 2026) {
        setError('year', 'Укажите год выпуска от 1980 до 2026.')
        isValid = false
      }

      if (task.length < 8) {
        setError('task', 'Коротко опишите задачу, минимум 8 символов.')
        isValid = false
      }
    }

    if (currentStep === 3) {
      const name = getFieldValue('name').trim()
      const phoneDigits = getFieldValue('phone').replace(/\D/g, '')

      if (name.length < 2) {
        setError('name', 'Укажите имя.')
        isValid = false
      }

      if (phoneDigits.length < 10) {
        setError('phone', 'Укажите телефон для связи.')
        isValid = false
      }
    }

    return isValid
  }

  const resetForm = (serviceId = '') => {
    form.reset()
    success.hidden = true
    form.hidden = false
    serviceSelect.value = serviceId
    updateSelectedServiceText()
    updateStep(1)
    clearErrors()
  }

  const closeModal = () => {
    backdrop.hidden = true
    document.body.style.overflow = ''

    if (lastActiveElement?.isConnected) {
      lastActiveElement.focus({ preventScroll: true })
    }
  }

  const openModal = (serviceId = '') => {
    lastActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    resetForm(serviceId)
    backdrop.hidden = false
    document.body.style.overflow = 'hidden'
    title.focus({ preventScroll: true })
  }

  const trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || backdrop.hidden) {
      return
    }

    const focusableElements = getFocusableElements(modal)

    if (focusableElements.length === 0) {
      event.preventDefault()
      modal.focus({ preventScroll: true })
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement
    const isFocusInsideDialog = activeElement ? modal.contains(activeElement) : false
    const isActiveFocusable =
      activeElement instanceof HTMLElement && focusableElements.includes(activeElement)

    if (!isFocusInsideDialog || !isActiveFocusable) {
      event.preventDefault()
      ;(event.shiftKey ? lastElement : firstElement).focus()
      return
    }

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
      return
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  document.querySelectorAll<HTMLButtonElement>('[data-booking-open]').forEach((button) => {
    button.addEventListener('click', () => {
      openModal(button.dataset.serviceId ?? '')
    })
  })

  document.querySelectorAll<HTMLElement>('[data-booking-close]').forEach((item) => {
    item.addEventListener('click', closeModal)
  })

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) {
      closeModal()
    }
  })

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !backdrop.hidden) {
      closeModal()
      return
    }

    trapFocus(event)
  })

  serviceSelect.addEventListener('change', () => {
    clearErrors()
    updateSelectedServiceText()
  })

  form.addEventListener('input', (event) => {
    if (event.target instanceof HTMLElement) {
      const fieldName = event.target.getAttribute('name')
      const error = fieldName
        ? form.querySelector<HTMLElement>(`[data-error-for="${fieldName}"]`)
        : null

      event.target.removeAttribute('aria-invalid')
      event.target.removeAttribute('aria-describedby')

      if (error) {
        error.hidden = true
        error.textContent = ''
      }
    }
  })

  backButton.addEventListener('click', () => {
    if (step > 1) {
      updateStep((step - 1) as Step)
    }
  })

  nextButton.addEventListener('click', () => {
    if (validateStep(step) && step < 3) {
      updateStep((step + 1) as Step)
    }
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!validateStep(3)) {
      return
    }

    form.hidden = true
    success.hidden = false
    success.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })
  })
}

redirectHashRoute()
window.addEventListener('hashchange', redirectHashRoute)
initMobileMenu()
initCatalogFilter()
initBookingModal()
