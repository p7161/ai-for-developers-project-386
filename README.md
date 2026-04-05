### Hexlet tests and linter status:
[![Actions Status](https://github.com/p7161/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/p7161/ai-for-developers-project-386/actions)

# Call Booking Service

Веб-приложение для записи на звонок. Гость выбирает дату и свободный 30-минутный слот в календаре, заполняет имя и email, после чего получает подтверждение бронирования.

## Стек

| Слой | Технологии |
|------|-----------|
| API-контракт | TypeSpec -> OpenAPI 3.0 |
| Фронтенд | React, TypeScript, Vite, Mantine UI |
| Бэкенд | Node.js, Express, better-sqlite3 (in-memory) |
| Mock-сервер | Stoplight Prism / встроенный in-memory mock |

## Структура проекта

```
.
├── main.tsp                        # TypeSpec-описание API
├── tsp-output/@typespec/openapi3/  # Сгенерированная OpenAPI-спецификация
├── backend/                        # Бэкенд-приложение
│   ├── src/
│   │   ├── index.js                # Точка входа, Express-сервер
│   │   ├── db.js                   # SQLite in-memory база данных
│   │   └── routes/
│   │       ├── eventTypes.js       # CRUD типов событий
│   │       ├── bookings.js         # Список бронирований (owner)
│   │       └── public.js           # Гостевое API
│   └── package.json
└── frontend/                       # Фронтенд-приложение
    ├── src/
    │   ├── api/
    │   │   ├── client.ts           # API-клиент и типы
    │   │   └── mock.ts             # In-memory mock для разработки
    │   ├── components/
    │   │   └── Header.tsx          # Навигация
    │   ├── pages/
    │   │   ├── BookingPage.tsx      # Страница записи на звонок
    │   │   └── EventsPage.tsx       # Предстоящие события
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

## Требования

- Node.js >= 18

## Быстрый старт

### 1. Установка зависимостей

```bash
# Корень проекта (TypeSpec)
npm install

# Бэкенд
cd backend
npm install

# Фронтенд
cd ../frontend
npm install
```

### 2. Генерация OpenAPI-спецификации (при изменении контракта)

```bash
npx tsp compile .
```

Результат появится в `tsp-output/@typespec/openapi3/openapi.yaml`.

### 3. Запуск бэкенда

```bash
cd backend
npm start
```

Сервер запустится на `http://localhost:3000`. Данные хранятся в SQLite in-memory — после перезапуска сбрасываются.

Для разработки с автоматическим перезапуском при изменении файлов:

```bash
npm run dev
```

### 4. Запуск фронтенда

```bash
cd frontend
npm run dev
```

Приложение откроется на `http://localhost:5173`.

По умолчанию используется встроенный in-memory mock — все данные хранятся в памяти браузера и сбрасываются при перезагрузке. Бэкенд не нужен.

### 5. Запуск с Prism (опционально)

Если нужно тестировать против OpenAPI-спецификации через Prism:

```bash
# Терминал 1 — mock-сервер
cd frontend
npm run mock-api

# Терминал 2 — фронтенд с реальными запросами
cd frontend
VITE_USE_MOCK=false npm run dev
```

Prism поднимется на `http://localhost:4010`, Vite проксирует `/api` на него.

## Переменные окружения

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `PORT` | `3000` | Порт бэкенд-сервера |
| `VITE_USE_MOCK` | `true` | `false` — использовать реальный API (Prism / бэкенд) |

## Сборка

```bash
cd frontend
npm run build
```

Результат в `frontend/dist/`. Для просмотра:

```bash
npm run preview
```

## Страницы

| Путь | Описание |
|------|----------|
| `/` | Запись на звонок — календарь, выбор слота, форма бронирования |
| `/events` | Предстоящие события — список всех бронирований |

## API-контракт

Полное описание API находится в `main.tsp`. Основные эндпоинты:

**Guest (публичный)**
- `GET /api/public/owner` — профиль владельца календаря
- `GET /api/public/calendar?month=YYYY-MM` — количество свободных слотов по дням
- `GET /api/public/slots?date=YYYY-MM-DD` — слоты на конкретный день
- `POST /api/public/bookings` — создание бронирования

**Owner**
- `GET /api/bookings` — список предстоящих бронирований
- `GET/POST/PATCH/DELETE /api/event-types` — управление типами событий
