# Исправление ошибки деплоя на Render

## Проблема
```
Error: Cannot find module '/opt/render/project/src/dist/index.js'
```

## Причины ошибки

### 1. ❌ Неправильный Root Directory в Render
**Самая частая причина!**

Render ищет файл в `/opt/render/project/src/dist/index.js`, что означает:
- Root Directory указан как `src/` (НЕПРАВИЛЬНО!)
- Render работает из папки `src/`, а не из корня проекта

### 2. ⚠️ Отсутствие devDependencies при установке
npm install в production режиме не устанавливает devDependencies (TypeScript, типы), необходимые для сборки.

### 3. ⚠️ Несоответствие менеджеров пакетов
Локально используется npm, а на Render использовался pnpm, что могло вызывать различия в структуре проекта.

## Решения

### ✅ Решение 1: Исправить Root Directory в Render

1. Зайдите в настройки вашего Web Service на Render.com
2. Найдите поле **"Root Directory"**
3. **ВАРИАНТ A** (если репозиторий содержит только backend):
   - Оставьте поле **пустым** или укажите **`.`** (точка)
   - Убедитесь, что `package.json` находится в корне репозитория

4. **ВАРИАНТ B** (если это monorepo - backend и frontend вместе):
   - Укажите: `incident_tracker_backend`
   - Это означает, что Render будет работать из папки `incident_tracker_backend/`

5. Сохраните изменения
6. Render автоматически запустит новый деплой

### ✅ Решение 2: Проверить структуру сборки

Структура проекта должна быть:

```
incident_tracker_backend/
├── package.json
├── tsconfig.json
├── src/
│   └── index.ts
└── dist/              ← Сюда компилируется
    └── index.js       ← Главный файл
```

**Проверка:**
```bash
# Локально проверьте сборку
cd incident_tracker_backend
npm run build

# Убедитесь, что файл существует
ls -la dist/index.js
```

### ✅ Решение 3: Проверить Build Command

В Render настройки должны быть:

**Build Command:**
```bash
npm install --include=dev && npm run build
```

**Start Command:**
```bash
npm run db:migrate:deploy && npm start
```

**Важно:** 
- Флаг `--include=dev` **ОБЯЗАТЕЛЕН** для установки TypeScript и других dev-зависимостей
- Без него npm не установит devDependencies в production окружении
- Это приведет к ошибкам компиляции TypeScript (Cannot find module '@types/express' и т.д.)

### ✅ Решение 4: Проверить переменные окружения

Убедитесь, что все переменные окружения установлены в Render:

```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
JWT_SECRET=<минимум 32 символа>
JWT_REFRESH_SECRET=<минимум 32 символа>
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=3001
```

**Важно для PostgreSQL:**
- DATABASE_URL должен начинаться с `postgresql://`
- Для Render PostgreSQL добавьте `?sslmode=require` в конце URL
- Пример: `postgresql://user:pass@host/db?sslmode=require`

## Диагностика

### Как проверить, что проблема в Root Directory:

1. Зайдите в логи деплоя на Render
2. Найдите строку с ошибкой
3. Если путь содержит `/src/dist/` - Root Directory указан неправильно
4. Правильный путь должен быть `/dist/index.js` (если Root Directory пустой)

### Проверка локально:

```bash
# 1. Перейдите в папку backend
cd incident_tracker_backend

# 2. Очистите старую сборку
rm -rf dist

# 3. Соберите проект
npm run build

# 4. Проверьте структуру
ls -la dist/
# Должен быть файл: dist/index.js

# 5. Проверьте, что файл запускается
node dist/index.js
# Должен запуститься без ошибок (если есть DATABASE_URL)
```

## Что было исправлено в коде

1. ✅ Изменен провайдер базы данных с SQLite на PostgreSQL
   - Обновлен `prisma/schema.prisma`: `provider = "postgresql"`
   - Обновлена миграция для PostgreSQL (DATETIME → TIMESTAMP(3))

2. ✅ Настроен `rootDir: "./"` в `tsconfig.json`
   - Это позволяет компилировать файлы из `src/` и `shared/` директорий
   - Структура сборки остается корректной

3. ✅ Переход с pnpm на npm
   - Добавлено поле `packageManager: "npm@10.0.0"` в `package.json`
   - Обновлены команды в `RENDER_DEPLOY.md` для использования npm

4. ✅ Добавлен флаг `--include=dev` в Build Command
   - Гарантирует установку devDependencies (TypeScript, типы) для сборки

5. ✅ Добавлены явные типы Router во всех route файлах
   - Исправлены ошибки TypeScript: `const router: Router = Router()`

6. ✅ Исправлены типы в jwt.ts, validate.ts и других файлах
   - Использование `as SignOptions` для корректной типизации

7. ✅ Обновлены инструкции в `RENDER_DEPLOY.md`
   - Добавлены четкие указания по настройке Root Directory
   - Добавлены инструкции по использованию npm с флагом `--include=dev`

## После исправления

1. Сохраните изменения в репозитории
2. В Render исправьте Root Directory
3. Сохраните настройки в Render
4. Дождитесь автоматического деплоя
5. Проверьте логи - должны увидеть:
   ```
   > npm run build
   > prisma generate && tsc
   ...
   > npm start
   > node dist/index.js
   Server started on port 3001
   ```

## Если проблема осталась

1. **Проверьте логи сборки:**
   - Убедитесь, что `npm run build` выполнился успешно
   - Должны быть файлы в `dist/`

2. **Проверьте логи запуска:**
   - Убедитесь, что `npm start` пытается запустить `dist/index.js`
   - Проверьте, что файл существует

3. **Проверьте структуру репозитория:**
   - Убедитесь, что `package.json` находится в правильной папке
   - Если monorepo - убедитесь, что Root Directory указывает на `incident_tracker_backend`

4. **Очистите и пересоберите:**
   ```bash
   # В Render можно добавить в Build Command:
   rm -rf dist node_modules && npm install --include=dev && npm run build
   ```
