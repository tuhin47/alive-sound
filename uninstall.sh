#!/bin/bash

# Alive Sound GNOME Extension Uninstaller

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Extension details
EXTENSION_NAME="alive-sound@example.com"
EXTENSIONS_DIR="$HOME/.local/share/gnome-shell/extensions"
TARGET_DIR="$EXTENSIONS_DIR/$EXTENSION_NAME"

echo -e "${GREEN}Alive Sound GNOME Extension Uninstaller${NC}"
echo "================================================"

# Check if extension is installed
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${YELLOW}Extension not found in $TARGET_DIR${NC}"
    echo "Nothing to uninstall."
    exit 0
fi

# Disable extension first
echo -e "${YELLOW}Disabling extension...${NC}"
if gnome-extensions list | grep -q "$EXTENSION_NAME"; then
    gnome-extensions disable "$EXTENSION_NAME" 2>/dev/null || true
fi

# Remove extension directory
echo -e "${YELLOW}Removing extension files...${NC}"
rm -rf "$TARGET_DIR"

echo -e "${GREEN}Uninstallation completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Restart GNOME Shell:"
echo "   - Press Alt+F2, type 'r', and press Enter"
echo "   - Or log out and log back in"
echo ""
echo -e "${GREEN}The extension has been completely removed.${NC}" 