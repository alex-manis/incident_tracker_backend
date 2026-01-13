# Деплой Backend на Render.com

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
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=3001
```

**Важно:** `FRONTEND_URL` должен указывать на ваш Vercel домен!

## Генерация JWT Secrets

Вы можете сгенерировать секреты через:
```bash
openssl rand -base64 32
```

## После настройки

1. Сохраните изменения
2. Render автоматически запустит новый деплой
3. Проверьте логи - должны увидеть успешную установку pnpm, сборку и запуск

## Проверка работоспособности

После успешного деплоя проверьте:
- Health endpoint: `https://your-backend-url.onrender.com/api/health`
- Должен вернуть: `{"status":"ok","database":"connected"}`
