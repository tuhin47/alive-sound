#!/bin/bash

# Alive Sound GNOME Extension Installer
# This script installs the extension to the user's GNOME extensions directory

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Extension details
EXTENSION_NAME="alive-sound@tuhintowhidul9@gmail.com"
EXTENSIONS_DIR="$HOME/.local/share/gnome-shell/extensions"
TARGET_DIR="$EXTENSIONS_DIR/$EXTENSION_NAME"

echo -e "${GREEN}Alive Sound GNOME Extension Installer${NC}"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "extension.js" ] || [ ! -f "metadata.json" ]; then
    echo -e "${RED}Error: Please run this script from the extension directory${NC}"
    echo "Make sure extension.js and metadata.json are in the current directory"
    exit 1
fi

# Create extensions directory if it doesn't exist
if [ ! -d "$EXTENSIONS_DIR" ]; then
    echo -e "${YELLOW}Creating extensions directory...${NC}"
    mkdir -p "$EXTENSIONS_DIR"
fi

# Remove existing installation if it exists
if [ -d "$TARGET_DIR" ]; then
    echo -e "${YELLOW}Removing existing installation...${NC}"
    rm -rf "$TARGET_DIR"
fi

# Copy extension files
echo -e "${YELLOW}Installing extension...${NC}"
cp -r . "$TARGET_DIR"

# Compile GSettings schema
if [ -d "schemas" ]; then
    echo -e "${YELLOW}Compiling GSettings schema...${NC}"
    cd "$TARGET_DIR"
    glib-compile-schemas schemas/
    cd - > /dev/null
fi

# Set proper permissions
echo -e "${YELLOW}Setting permissions...${NC}"
chmod -R 755 "$TARGET_DIR"

echo -e "${GREEN}Installation completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Restart GNOME Shell:"
echo "   - Press Alt+F2, type 'r', and press Enter"
echo "   - Or log out and log back in"
echo ""
echo "2. Enable the extension:"
echo "   - Open GNOME Extensions app"
echo "   - Find 'Alive Sound' and toggle it on"
echo "   - Or run: gnome-extensions enable $EXTENSION_NAME"
echo ""
echo -e "${GREEN}The extension will appear as a speaker icon in your system tray.${NC}" 