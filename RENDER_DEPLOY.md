# Деплой Backend на Render.com

## Настройки для Render.com

В панели управления вашего Backend сервиса на Render.com укажите следующие настройки:

### Build Command:
```bash
npm install && npm run build
```

### Start Command:
```bash
npm run db:migrate:deploy && npm start
```

**Примечание:** Если вы предпочитаете использовать pnpm, используйте:
```bash
corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm build
```
И для Start Command:
```bash
pnpm db:migrate:deploy && pnpm start
```

### Root Directory:
**ВАЖНО:** Укажите Root Directory как `.` (точка) или оставьте пустым, но убедитесь, что рабочая директория - это корень репозитория, а не `src/`.

Если файл `dist/index.js` не найден, это означает, что Root Directory настроен неправильно. На Render рабочая директория должна быть корнем репозитория (где находится `package.json`), а не поддиректорией `src/`.

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
