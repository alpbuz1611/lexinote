#!/usr/bin/env bash
set -e

# LexiNote — Çok Dilli Akıllı Not & Günlük Başlatıcı
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"

cd "$ROOT_DIR"

export PATH="$HOME/.cargo/bin:$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# Renkler
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "==============================================================="
echo "   __             _ _   _       _       "
echo "  / /  _____  __ (_) \ | | ___ | |_ ___ "
echo " / /  / _ \ \/ / | |  \| |/ _ \| __/ _ \ "
echo "/ /__|  __/>  <  | | |\  | (_) | ||  __/"
echo "\____/\___/_/\_\ |_|_| \_|\___/ \__\___|"
echo "  Çok Dilli Akıllı Not & Günlük — Masaüstü Uygulaması"
echo "==============================================================="
echo -e "${NC}"

# Eğer dist klasörü yoksa bir kez derle
if [ ! -f "$ROOT_DIR/dist/index.html" ]; then
    echo -e "${YELLOW}İlk kurulum derlemesi yapılıyor...${NC}"
    npm run build
fi

# Port 5252: LexiNote'a özel atanmış port (Nexus ile çakışmaz)
export LEXINOTE_PORT=5252

echo -e "${GREEN}✓ LexiNote yerel masaüstü penceresi başlatılıyor...${NC}"

# Electron ile yerel masaüstü penceresini aç (--no-sandbox Arch Linux ve container uyumluluğu için)
exec npx electron --no-sandbox "$ROOT_DIR/electron/main.cjs" "$@"
