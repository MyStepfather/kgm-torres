# Деплой на Ubuntu VPS

Стек: **Docker** (PostgreSQL + приложение) + **nginx** на хосте + **Certbot** когда появится домен.

PM2 не нужен — приложение в контейнере с `restart: unless-stopped`.

---

## 0. Пока нет домена

- Сайт открывается по **HTTP** и **IP сервера**: `http://203.0.113.10`
- **Let's Encrypt на голый IP не выдаёт** сертификаты — нужен домен и A-запись
- В `.env` укажите `NEXT_PUBLIC_APP_URL=http://ВАШ_IP` — от этого зависят QR-коды

Когда домен будет готов — раздел [HTTPS с Certbot](#https-с-certbot).

---

## 1. Подготовка сервера (Ubuntu 22.04/24.04)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx certbot python3-certbot-nginx ufw

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# перелогиньтесь или: newgrp docker

sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 2. Клонирование и настройка

```bash
cd ~
git clone <URL_РЕПОЗИТОРИЯ> kgm-torres
cd kgm-torres

cp .env.production.example .env
nano .env
```

Обязательно задайте:

- `POSTGRES_PASSWORD` — надёжный пароль
- `NEXT_PUBLIC_APP_URL` — `http://IP_СЕРВЕРА`
- `ADMIN_PASSWORD`, `ADMIN_SESSION_TOKEN`

Если используете **Neon** вместо локального Postgres:

1. Пропишите `DATABASE_URL` в `.env`
2. В `docker-compose.prod.yml` закомментируйте сервис `postgres` и `depends_on` у `app`
3. Уберите `environment.DATABASE_URL` override у `app` (оставьте только `env_file`)

---

## 3. Сборка и запуск

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs -f app
```

Миграции применяются автоматически при старте контейнера (`prisma migrate deploy`).

Импорт дилеров (один раз). С вашего компьютера через SSH-туннель:

```bash
# Терминал 1 — туннель (postgres слушает только localhost на сервере)
ssh -L 5433:127.0.0.1:5432 user@ВАШ_IP

# Терминал 2 — из клона репозитория локально
DATABASE_URL="postgresql://kgm:ВАШ_ПАРОЛЬ@localhost:5433/kgm_torres?schema=public" npm run db:import-dealers
```

PIN-ы появятся в `data/dealer-credentials.xlsx`.

---

## 4. nginx (HTTP по IP)

```bash
sudo cp deploy/nginx/kgm-torres-http.conf /etc/nginx/sites-available/kgm-torres
sudo ln -sf /etc/nginx/sites-available/kgm-torres /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Проверка: `http://ВАШ_IP` → лендинг, `/admin` → админка.

---

## HTTPS с Certbot

Когда домен `kgm-drive.ru` указывает A-записью на IP сервера (`104.128.129.200`):

1. В `.env` на сервере:
   ```env
   NEXT_PUBLIC_APP_URL="https://kgm-drive.ru"
   ```
2. Пересоберите app (нужен для `NEXT_PUBLIC_*`):
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build app
   ```
3. Nginx с блоком для домена:
   ```bash
   sudo cp deploy/nginx/kgm-torres-http-domain.conf /etc/nginx/sites-available/kgm-torres
   sudo ln -sf /etc/nginx/sites-available/kgm-torres /etc/nginx/sites-enabled/
   sudo mkdir -p /var/www/certbot
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. Проверьте DNS (должен вернуть IP сервера):
   ```bash
   dig +short kgm-drive.ru A
   ```
5. Сертификат:
   ```bash
   sudo certbot --nginx -d kgm-drive.ru -d www.kgm-drive.ru \
     --non-interactive --agree-tos -m promo@kgm-drive.ru --redirect
   ```
6. Автопродление — через systemd timer certbot (уже есть после установки certbot).

---

## Обновление версии

```bash
cd ~/kgm-torres
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Полезные команды

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app
docker compose -f docker-compose.prod.yml restart app

# Бэкап БД
docker exec kgm-torres-db pg_dump -U kgm kgm_torres > backup.sql
```

---

## Docker vs PM2

| | Docker (рекомендуем) | PM2 |
|---|---|---|
| Postgres | в compose | отдельно / Neon |
| Деплой | `docker compose up --build` | `npm run build` + `pm2 start` |
| Откат | образы / git | вручную |
| Зависимости | в образе | на сервере Node 20 |

Для этого проекта проще **Docker + nginx на хосте**.
