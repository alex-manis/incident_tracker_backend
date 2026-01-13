# Incident Tracker Backend

Express API сервер для системы отслеживания инцидентов.

## Технологии

- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT аутентификация с refresh token rotation
- pino logger
- Prometheus metrics

## Установка

```bash
pnpm install
```

## Настройка

1. Скопируйте `.env.example` в `.env`
2. Настройте переменные окружения:
   - `DATABASE_URL` - строка подключения к PostgreSQL
   - `JWT_SECRET` - секретный ключ для JWT (минимум 32 символа)
   - `JWT_REFRESH_SECRET` - секретный ключ для refresh token (минимум 32 символа)
   - `PORT` - порт сервера (по умолчанию 3001)
   - `FRONTEND_URL` - URL фронтенда для CORS

## Запуск

```bash
# Разработка
pnpm dev

# Продакшн
pnpm build
pnpm start
```

## База данных

```bash
# Генерация Prisma клиента
pnpm db:generate

# Миграции
pnpm db:migrate

# Семена (тестовые данные)
pnpm db:seed

# Prisma Studio
pnpm db:studio
```

## API Endpoints

- `POST /auth/login` - Вход
- `POST /auth/refresh` - Обновление токена
- `POST /auth/logout` - Выход
- `GET /auth/me` - Текущий пользователь
- `GET /users` - Список пользователей
- `GET /incidents` - Список инцидентов
- `POST /incidents` - Создать инцидент
- `GET /incidents/:id` - Детали инцидента
- `PATCH /incidents/:id` - Обновить инцидент
- `GET /incidents/:id/comments` - Комментарии
- `POST /incidents/:id/comments` - Создать комментарий
- `GET /incidents/:id/audit` - История изменений
- `GET /dashboard/summary` - Статистика
- `GET /health` - Проверка здоровья
- `GET /metrics` - Prometheus метрики

## Структура проекта

```
src/
├── config.ts           # Конфигурация
├── index.ts            # Точка входа
├── controllers/        # Контроллеры
├── services/          # Бизнес-логика
├── repositories/       # Работа с БД
├── routes/            # Маршруты
├── middleware/        # Middleware
└── lib/               # Утилиты (logger, jwt, hash)
```

## Зависимости

Проект использует общий пакет `@incident-tracker/shared` для типов и схем. Убедитесь, что он доступен в workspace или установлен отдельно.
