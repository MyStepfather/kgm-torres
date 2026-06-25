# KGM Torres — лендинг тест-драйва и розыгрыша Champion

Лендинг для записи на тест-драйв KGM Torres с участием в розыгрыше садовой техники Champion. Стек: **Next.js (TypeScript)**, **Prisma**, **PostgreSQL (Docker Compose)**.

## Возможности

- Лендинг с 6 секциями (Hero, О Torres, Призы, Как участвовать, Форма, Футер)
- Регистрация клиента с выбором дилера
- Генерация QR-кода со ссылкой на кабинет дилера
- Кабинет дилера: вход по логину + 4-значному PIN, просмотр данных клиента, активация участия

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Запустить PostgreSQL (docker-compose.yml)
npm run db:up

# 3. Применить миграции
npm run db:migrate

# 4. Заполнить дилеров (тестовые данные)
npm run db:seed

# 5. Запустить dev-сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Тестовые учётные данные дилеров

| Город | Логин | PIN |
|-------|-------|-----|
| Москва | `moscow` | `1234` |
| Санкт-Петербург | `spb` | `2345` |
| Казань | `kazan` | `3456` |
| Екатеринбург | `ekb` | `4567` |
| Новосибирск | `nsk` | `5678` |

## Поток работы

1. Клиент заполняет форму на лендинге и выбирает дилера
2. После отправки получает QR-код (ссылка вида `/dealer/scan/{token}`)
3. На тест-драйве показывает QR дилеру
4. Дилер сканирует QR → входит в кабинет → видит данные клиента → нажимает «Активировать»
5. В БД сохраняется `isActivated = true` и `activatedAt`

## Переменные окружения

Скопируйте `.env.example` в `.env`:

```env
DATABASE_URL="postgresql://kgm:kgm_secret@localhost:5432/kgm_torres?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Порт `5432` проброшен из контейнера `kgm-torres-db` (`docker-compose.yml`).

## Полезные команды

```bash
npm run db:studio   # Prisma Studio (просмотр БД)
npm run db:down     # Остановить PostgreSQL
npm run build       # Production-сборка
```
