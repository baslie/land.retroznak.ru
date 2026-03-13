#!/bin/bash

################################################################################
# Универсальный скрипт развертывания проектов Retroznak на Beget
# Версия: 2.0
# Использование: ./deploy.sh
################################################################################

# ============================================================================
# ОБЩИЕ НАСТРОЙКИ
# ============================================================================

# Путь к Node.js на сервере Beget
NODE_PATH="/home/e/***REMOVED***/.local/bin/node"

# Git репозиторий (содержит оба проекта)
GIT_REPO="git@github.com:baslie/land.retroznak.ru.git"
GIT_BRANCH="main"

# SMTP настройки для отправки email (общие для обоих проектов)
SMTP_HOST="smtp.beget.com"
SMTP_PORT="465"
SMTP_USER="info@retroznak.ru"
SMTP_PASSWORD='***REMOVED***'
MAIL_FROM="info@retroznak.ru"
MAIL_TO="***REMOVED***,***REMOVED***"

# ============================================================================
# НАСТРОЙКИ ПРОЕКТОВ
# ============================================================================

# Общая директория для развертывания (оба проекта используют один домен)
DEPLOY_ROOT="$HOME/land.retroznak.ru"
DEPLOY_APP_DIR="$DEPLOY_ROOT/app"
DEPLOY_SITE_URL="https://land.retroznak.ru/"

# Имена проектов (папки в репозитории)
LAND_PROJECT_NAME="land.retroznak.ru"
CONSTRUCTOR_PROJECT_NAME="constructor.retroznak.ru"

# ============================================================================
# ЦВЕТА ДЛЯ ВЫВОДА
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ============================================================================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# ============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

step() {
    echo ""
    echo -e "${GREEN}==>${NC} $1"
}

check_error() {
    if [ $? -ne 0 ]; then
        log_error "$1"
        exit 1
    fi
}

# ============================================================================
# ПРОВЕРКА ОКРУЖЕНИЯ
# ============================================================================

check_environment() {
    step "Проверка окружения"

    # Проверка Docker-оболочки
    if [[ "$PS1" != *"(docker)"* ]]; then
        log_warning "Вы не находитесь в Docker-оболочке Beget"
        log_info "Подключитесь командой: ssh localhost -p 222"
        read -p "Продолжить всё равно? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    # Проверка Node.js
    if [ ! -f "$NODE_PATH" ]; then
        log_error "Node.js не найден по пути: $NODE_PATH"
        log_info "Установите Node.js или укажите правильный путь в переменной NODE_PATH"
        exit 1
    fi

    log_info "Node.js версия: $($NODE_PATH -v)"
    log_info "npm версия: $(npm -v)"
    log_success "Окружение проверено"
}

# ============================================================================
# ВЫБОР ПРОЕКТА
# ============================================================================

select_project() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}  Выберите проект для развертывания:${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
    echo "  1) land.retroznak.ru        - Лендинг компании"
    echo "  2) constructor.retroznak.ru - Конструктор табличек"
    echo ""
    echo -e "${YELLOW}  Внимание: выбранный проект заменит текущий на домене${NC}"
    echo ""
    read -p "Введите номер (1 или 2): " -n 1 -r
    echo ""

    # Общие настройки для обоих проектов (один домен)
    PROJECT_ROOT="$DEPLOY_ROOT"
    APP_DIR="$DEPLOY_APP_DIR"
    SITE_URL="$DEPLOY_SITE_URL"

    case $REPLY in
        1)
            PROJECT_NAME="$LAND_PROJECT_NAME"
            PROJECT_SUBDIR="land.retroznak.ru"
            log_info "Выбран проект: Лендинг ($PROJECT_NAME)"
            ;;
        2)
            PROJECT_NAME="$CONSTRUCTOR_PROJECT_NAME"
            PROJECT_SUBDIR="constructor.retroznak.ru"
            log_info "Выбран проект: Конструктор ($PROJECT_NAME)"
            ;;
        *)
            log_error "Неверный выбор. Введите 1 или 2."
            exit 1
            ;;
    esac

    log_info "Проект будет развернут на: $SITE_URL"
}

# ============================================================================
# РАЗВЕРТЫВАНИЕ ПРОЕКТА
# ============================================================================

deploy() {
    step "Начинаем развертывание проекта $PROJECT_NAME"

    # Шаг 1: Очистка старого проекта
    step "Шаг 1: Очистка старого проекта"
    log_info "Удаляем старые файлы..."
    rm -rf "$APP_DIR"
    rm -f "$PROJECT_ROOT/.htaccess"
    mkdir -p "$APP_DIR"
    mkdir -p "$PROJECT_ROOT"
    check_error "Не удалось очистить проект"
    log_success "Старый проект удален"

    # Шаг 2: Клонирование репозитория
    step "Шаг 2: Клонирование репозитория"
    log_info "Клонируем из $GIT_REPO"
    cd "$PROJECT_ROOT"

    # Клонируем во временную папку
    rm -rf temp_clone
    git clone "$GIT_REPO" temp_clone
    check_error "Не удалось склонировать репозиторий"

    cd temp_clone
    git checkout "$GIT_BRANCH"
    check_error "Не удалось переключиться на ветку $GIT_BRANCH"

    # Копируем только нужную папку проекта
    cd "$PROJECT_ROOT"
    cp -r "temp_clone/$PROJECT_SUBDIR/." "$APP_DIR/"
    rm -rf temp_clone

    cd "$APP_DIR"
    log_success "Репозиторий склонирован, проект $PROJECT_NAME извлечен"

    # Шаг 3: Проверка Node.js
    step "Шаг 3: Проверка Node.js"
    $NODE_PATH -v && npm -v
    check_error "Проблемы с Node.js"
    log_success "Node.js проверен"

    # Шаг 4: Установка прав
    step "Шаг 4: Установка прав доступа"
    log_info "Устанавливаем права для Passenger..."
    chmod 755 ~/.local ~/.local/bin "$NODE_PATH"
    find "$APP_DIR" -type d -exec chmod 755 {} \;
    find "$APP_DIR" -type f -exec chmod 644 {} \;
    check_error "Не удалось установить права"
    log_success "Права установлены"

    # Шаг 5: Проверка next.config.mjs
    step "Шаг 5: Проверка next.config.mjs"
    if [ ! -f "$APP_DIR/next.config.mjs" ]; then
        log_error "next.config.mjs отсутствует в проекте!"
        exit 1
    fi
    log_success "next.config.mjs найден"

    # Шаг 6: Создание .env.local
    step "Шаг 6: Создание .env.local"
    cat > "$APP_DIR/.env.local" << EOF
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER
SMTP_PASSWORD=$SMTP_PASSWORD
MAIL_FROM=$MAIL_FROM
MAIL_TO=$MAIL_TO
EOF
    chmod 600 "$APP_DIR/.env.local"
    check_error "Не удалось создать .env.local"
    log_success ".env.local создан"

    # Шаг 7: Создание server.js
    step "Шаг 7: Создание server.js"
    cat > "$APP_DIR/server.js" << 'EOF'
const path = require('path');
const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next');
process.argv.length = 1;
process.argv.push(nextPath, 'start', '--hostname=127.0.0.1');
require(nextPath);
EOF
    chmod 644 "$APP_DIR/server.js"
    check_error "Не удалось создать server.js"
    log_success "server.js создан"

    # Шаг 8: Создание .htaccess
    step "Шаг 8: Создание .htaccess"
    cat > "$PROJECT_ROOT/.htaccess" << EOF
# Редирект с HTTP на HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)\$ https://%{HTTP_HOST}/\$1 [R=301,L]

# Настройки Passenger для запуска Node.js
PassengerNodejs $NODE_PATH
PassengerAppRoot $APP_DIR
PassengerAppType node
PassengerStartupFile server.js
EOF
    chmod 644 "$PROJECT_ROOT/.htaccess"
    check_error "Не удалось создать .htaccess"
    log_success ".htaccess создан"

    # Шаг 9: Установка зависимостей
    step "Шаг 9: Установка зависимостей"
    cd "$APP_DIR"
    log_info "Удаляем старые node_modules и .next..."
    rm -rf node_modules .next
    log_info "Устанавливаем зависимости (это может занять несколько минут)..."
    npm ci
    check_error "Не удалось установить зависимости"
    log_success "Зависимости установлены"

    # Шаг 10: Сборка проекта
    step "Шаг 10: Сборка проекта"
    log_info "Собираем production-версию..."
    NEXT_TELEMETRY_DISABLED=1 npm run build
    check_error "Не удалось собрать проект"
    log_success "Проект собран"

    # Шаг 11: Перезапуск Passenger
    step "Шаг 11: Перезапуск Passenger"
    mkdir -p "$APP_DIR/tmp"
    touch "$APP_DIR/tmp/restart.txt"
    check_error "Не удалось перезапустить Passenger"
    log_success "Passenger перезапущен"

    step "Развертывание $PROJECT_NAME завершено!"
    log_info "Сайт доступен по адресу: $SITE_URL"
    log_info "Проверьте логи: tail -n 200 $APP_DIR/tmp/restart.txt.log"
}

# ============================================================================
# ТОЧКА ВХОДА
# ============================================================================

main() {
    clear
    echo ""
    echo "========================================================================"
    echo "     Универсальный скрипт развертывания Retroznak на Beget v2.0"
    echo "========================================================================"
    echo ""

    check_environment
    select_project
    deploy
}

# Запуск скрипта
main "$@"
