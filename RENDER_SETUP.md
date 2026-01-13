# Настройка деплоя на Render.com для Backend

## Проблема с yarn

Render по умолчанию использует `yarn`, но проект использует `pnpm`. Нужно настроить правильные команды сборки.

## Настройки для Render.com

В панели управления вашего Backend сервиса на Render.com укажите следующие настройки:

### Build Command:
```bash
corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm build
```

### Start Command:
```bash
pnpm db:migrate:deploy && pnpm start
```

### Root Directory:
Оставьте **пустым** (так как репозиторий уже содержит только backend код)

### Environment Variables:
```
NODE_ENV=production
DATABASE_URL=<Internal Database URL от PostgreSQL сервиса>
JWT_SECRET=<сгенерируйте случайную строку минимум 32 символа>
JWT_REFRESH_SECRET=<сгенерируйте случайную строку минимум 32 символа>
FRONTEND_URL=https://your-frontend-url.onrender.com
PORT=3001
```

## Генерация JWT Secrets

Вы можете сгенерировать секреты через:
```bash
openssl rand -base64 32
```

Или использовать онлайн генератор случайных строк.

## После настройки

1. Сохраните изменения
2. Render автоматически запустит новый деплой
3. Проверьте логи - должны увидеть успешную установку pnpm, сборку и запуск

## Проверка работоспособности

После успешного деплоя проверьте:
- Health endpoint: `https://your-backend-url.onrender.com/api/health`
- Должен вернуть: `{"status":"ok","database":"connected"}`
