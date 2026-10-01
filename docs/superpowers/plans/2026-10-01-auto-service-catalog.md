# Auto Service Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать учебный React/TypeScript portfolio demo сайт автосервиса с каталогом, фильтрами, страницами услуг и многошаговой demo-записью.

**Architecture:** Vite-приложение на React Router. Данные услуг живут отдельно от UI, форма записи управляется локальным состоянием в `BookingModal`, а страницы получают callback открытия формы из `App`.

**Tech Stack:** Vite, React, TypeScript, React Router, lucide-react, обычный CSS, frontend-only.

## Global Constraints

- Не добавлять backend, базу данных, авторизацию, оплату и push.
- Не добавлять фейковые отзывы, рейтинги, логотипы партнёров, реальных клиентов и неподтверждённые proof claims.
- Контакты и запись остаются demo-форматом.
- Hero светлый и спокойный, акцент на каталоге, фильтрах, карточках услуг и многошаговой записи.

---

### Task 1: Каркас данных и роутинга

**Files:**
- Create: `src/types.ts`
- Create: `src/data/services.ts`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `Service`, `ServiceCategory`, `services`, `serviceCategories`, `getServiceBySlug`.

- [x] Создать типы категорий, услуг и состояния формы.
- [x] Добавить 10 услуг из задания с честными описаниями.
- [x] Подключить `BrowserRouter` и маршруты `/`, `/services`, `/services/:slug`, `/contacts`.

### Task 2: Компоненты интерфейса

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/Hero.tsx`
- Create: `src/components/ServiceCard.tsx`
- Create: `src/components/CategoryFilter.tsx`
- Create: `src/components/BookingModal.tsx`

**Interfaces:**
- Consumes: `Service`, `ServiceCategory`, `services`.
- Produces: переиспользуемые компоненты для страниц и формы.

- [x] Реализовать desktop/mobile навигацию с burger menu.
- [x] Реализовать hero, карточку услуги и фильтр категорий.
- [x] Реализовать модальную форму с тремя шагами, валидацией и success-состоянием.

### Task 3: Страницы

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/ServicesPage.tsx`
- Create: `src/pages/ServiceDetailPage.tsx`
- Create: `src/pages/ContactsPage.tsx`

**Interfaces:**
- Consumes: компоненты и данные из задач 1-2.

- [x] Собрать главную страницу с популярными услугами, категориями, процессом и demo-плашкой.
- [x] Собрать каталог с фильтром без перезагрузки.
- [x] Собрать страницу услуги с предвыбором услуги для формы.
- [x] Собрать demo-контакты.

### Task 4: Стили, README и проверка

**Files:**
- Modify: `src/index.css`
- Modify: `README.md`
- Delete: шаблонные Vite-ассеты, если не используются.

- [x] Добавить mobile-first CSS без тяжёлых UI-библиотек.
- [x] Написать README на русском.
- [x] Запустить `npm run build`, `npm run lint`, browser-проверку роутов, фильтра, формы, консоли и адаптива.
- [ ] После успешной проверки сделать первый commit на русском языке.
