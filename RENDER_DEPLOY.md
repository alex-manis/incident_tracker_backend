# Деплой Backend на Render.com

## Настройки для Render.com

В панели управления вашего Backend сервиса на Render.com укажите следующие настройки:

### Build Command:
```bash
npm install --include=dev && npm run build
```

**Важно:** Флаг `--include=dev` необходим для установки devDependencies (TypeScript, типы и т.д.), которые требуются для сборки проекта. Без этого флага npm не установит devDependencies в production окружении.

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
**КРИТИЧЕСКИ ВАЖНО:** 

1. **Если ваш репозиторий содержит только backend код:**
   - Root Directory должен быть **пустым** или **`.`** (точка)
   - Это означает, что `package.json` находится в корне репозитория

2. **Если ваш репозиторий - monorepo (backend и frontend в одном репозитории):**
   - Root Directory должен быть: `incident_tracker_backend`
   - Это означает, что Render будет работать из папки `incident_tracker_backend/`

**Как проверить:**
- Если ошибка: `Cannot find module '/opt/render/project/src/dist/index.js'`
  - Это означает, что Root Directory указан как `src/` - **НЕПРАВИЛЬНО!**
  - Измените на пустое значение или `incident_tracker_backend` (если monorepo)

- Правильный путь к файлу должен быть: `/opt/render/project/dist/index.js` (если Root Directory пустой)
- Или: `/opt/render/project/incident_tracker_backend/dist/index.js` (если Root Directory = `incident_tracker_backend`)

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
