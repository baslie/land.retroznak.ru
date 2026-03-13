# Развертывание на Beget

Полная инструкция по развёртыванию проектов Retroznak на хостинге Beget (shared + Passenger).

> **Важно:** Оба проекта разворачиваются на один домен `land.retroznak.ru`. При деплое выбранный проект заменяет предыдущий.

---

## Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Подключение к серверу](#подключение-к-серверу)
3. [Использование скрипта](#использование-скрипта)
4. [Ручное развертывание](#ручное-развертывание)
5. [Архитектура](#архитектура)
6. [Решение проблем](#решение-проблем)

---

## Быстрый старт

```bash
# 1. Подключиться к серверу
ssh <YOUR_BEGET_LOGIN>@<YOUR_BEGET_SERVER>

# 2. Войти в Docker-оболочку
ssh localhost -p 222

# 3. Запустить скрипт
cd ~/land.retroznak.ru
./deploy.sh
```

Скрипт предложит выбрать проект:
- `1` — Лендинг (land.retroznak.ru)
- `2` — Конструктор (constructor.retroznak.ru)

---

## Подключение к серверу

### Шаг 1: SSH подключение

```bash
ssh <YOUR_BEGET_LOGIN>@<YOUR_BEGET_SERVER>
```

### Шаг 2: Вход в Docker-оболочку

```bash
ssh localhost -p 222
```

После входа строка приглашения изменится на:
```
(docker) <YOUR_BEGET_LOGIN>@<server>:~ [0] $
```

> Все команды выполняются **внутри Docker**.

---

## Использование скрипта

### Первоначальная настройка

1. Загрузите `deploy.sh` в папку домена `~/land.retroznak.ru/`
2. Установите права на выполнение:
   ```bash
   chmod +x ~/land.retroznak.ru/deploy.sh
   ```

### Запуск

```bash
cd ~/land.retroznak.ru
./deploy.sh
```

### Что делает скрипт

1. Проверяет окружение (Docker, Node.js)
2. Предлагает выбрать проект
3. Удаляет старый проект
4. Клонирует репозиторий и извлекает нужную папку
5. Устанавливает права доступа
6. Создаёт конфигурационные файлы (.env.local, server.js, .htaccess)
7. Устанавливает зависимости (`npm ci`)
8. Собирает production-версию (`npm run build`)
9. Перезапускает приложение

**Время выполнения:** 3-7 минут

### Настройки скрипта

Основные переменные в начале файла:

```bash
# Путь к Node.js
NODE_PATH="/home/e/<YOUR_BEGET_LOGIN>/.local/bin/node"

# Git репозиторий
GIT_REPO="git@github.com:baslie/land.retroznak.ru.git"
GIT_BRANCH="main"

# SMTP настройки (задаются через переменные окружения)
SMTP_HOST="smtp.beget.com"
SMTP_PORT="465"
SMTP_USER=<YOUR_SMTP_USER>
SMTP_PASSWORD=<YOUR_SMTP_PASSWORD>
MAIL_FROM=<YOUR_MAIL_FROM>
MAIL_TO=<YOUR_EMAILS>

# Директория развертывания (одна для обоих проектов)
DEPLOY_ROOT="$HOME/land.retroznak.ru"
DEPLOY_SITE_URL="https://land.retroznak.ru/"
```

---

## Ручное развертывание

Для тех, кто хочет выполнить развертывание вручную или понять процесс.

### Полный скрипт

```bash
# 1) Очистка старого проекта
rm -rf ~/land.retroznak.ru/app
rm -f ~/land.retroznak.ru/.htaccess
mkdir -p ~/land.retroznak.ru/app

# 2) Клонирование проекта
cd ~/land.retroznak.ru
git clone git@github.com:baslie/land.retroznak.ru.git temp_clone
# Для лендинга:
cp -r temp_clone/land.retroznak.ru/. app/
# Для конструктора:
# cp -r temp_clone/constructor.retroznak.ru/. app/
rm -rf temp_clone

# 3) Проверка Node.js
/home/e/<YOUR_BEGET_LOGIN>/.local/bin/node -v && npm -v

# 4) Установка прав
chmod 755 ~/.local ~/.local/bin ~/.local/bin/node
find ~/land.retroznak.ru/app -type d -exec chmod 755 {} \;
find ~/land.retroznak.ru/app -type f -exec chmod 644 {} \;

# 5) Создание .env.local
cat > ~/land.retroznak.ru/app/.env.local << 'EOF'
SMTP_HOST=smtp.beget.com
SMTP_PORT=465
SMTP_USER=<YOUR_SMTP_USER>
SMTP_PASSWORD=<YOUR_SMTP_PASSWORD>
MAIL_FROM=<YOUR_MAIL_FROM>
MAIL_TO=<YOUR_EMAILS>
EOF
chmod 600 ~/land.retroznak.ru/app/.env.local

# 6) Создание server.js
cat > ~/land.retroznak.ru/app/server.js << 'EOF'
const path = require('path');
const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next');
process.argv.length = 1;
process.argv.push(nextPath, 'start', '--hostname=127.0.0.1');
require(nextPath);
EOF
chmod 644 ~/land.retroznak.ru/app/server.js

# 7) Создание .htaccess
cat > ~/land.retroznak.ru/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

PassengerNodejs /home/e/<YOUR_BEGET_LOGIN>/.local/bin/node
PassengerAppRoot /home/e/<YOUR_BEGET_LOGIN>/land.retroznak.ru/app
PassengerAppType node
PassengerStartupFile server.js
EOF
chmod 644 ~/land.retroznak.ru/.htaccess

# 8) Установка зависимостей и сборка
cd ~/land.retroznak.ru/app
rm -rf node_modules .next
npm ci
NEXT_TELEMETRY_DISABLED=1 npm run build

# 9) Перезапуск Passenger
mkdir -p ~/land.retroznak.ru/app/tmp
touch ~/land.retroznak.ru/app/tmp/restart.txt

echo "Готово! Проверьте: https://land.retroznak.ru/"
```

### Пояснения к шагам

#### Права доступа
- `755` для директорий — Passenger может читать и переходить
- `644` для файлов — чтение для всех, запись только владельцу
- `600` для .env.local — только владелец (содержит пароли)

#### server.js
Passenger не умеет запускать npm-скрипты. Файл `server.js` — точка входа, которая запускает Next.js.

#### .htaccess
- Редирект HTTP → HTTPS
- Настройки Passenger для Node.js
- Должен лежать в `~/land.retroznak.ru/`, а не в `app/`

---

## Архитектура

```
Пользователь → Apache (80/443) → Passenger → Node.js → Next.js
                     ↓
               .htaccess
               (настройки Passenger)
```

### Структура на сервере

```
~/land.retroznak.ru/
├── deploy.sh          # Скрипт развертывания
├── .htaccess          # Конфигурация Apache + Passenger
└── app/               # Исходники проекта
    ├── .env.local     # Переменные окружения
    ├── server.js      # Точка входа для Passenger
    ├── node_modules/
    ├── .next/         # Собранный проект
    └── tmp/
        └── restart.txt     # Файл для перезапуска
```

---

## Решение проблем

### Просмотр логов

```bash
# Последние 200 строк
tail -n 200 ~/land.retroznak.ru/app/tmp/restart.txt.log

# В реальном времени
tail -f ~/land.retroznak.ru/app/tmp/restart.txt.log
```

### Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `Permission denied` | Неправильные права | `chmod 755 ~/.local/bin/node` |
| `Cannot find module` | Не установлены зависимости | `npm ci` |
| `EADDRINUSE` | Порт занят | Подождите или перезапустите |

### Перезапуск приложения

```bash
touch ~/land.retroznak.ru/app/tmp/restart.txt
```

### Если SSH-ключ не настроен

Используйте HTTPS вместо SSH:
```bash
git clone https://github.com/baslie/land.retroznak.ru.git temp_clone
```

### Очистка и полный передеплой

```bash
cd ~/land.retroznak.ru
rm -rf app
./deploy.sh
```

---

## Полезные команды

```bash
# Проверка статуса
ls -la ~/land.retroznak.ru/

# Проверка версии Node.js
/home/e/<YOUR_BEGET_LOGIN>/.local/bin/node -v

# Размер проекта
du -sh ~/land.retroznak.ru/app

# Очистка логов
> ~/land.retroznak.ru/app/tmp/restart.txt.log

# Принудительный перезапуск
touch ~/land.retroznak.ru/app/tmp/restart.txt
```

---

## Обновление проекта

После изменений в репозитории:

```bash
cd ~/land.retroznak.ru
./deploy.sh
```

Или вручную:

```bash
cd ~/land.retroznak.ru/app
git pull
npm ci
npm run build
touch tmp/restart.txt
```
