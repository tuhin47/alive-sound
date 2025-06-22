#!/bin/bash

# Test script for Alive Sound GNOME Extension

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Alive Sound Extension Test${NC}"
echo "================================"

# Check if extension is installed
EXTENSION_NAME="alive-sound@example.com"
EXTENSIONS_DIR="$HOME/.local/share/gnome-shell/extensions"
TARGET_DIR="$EXTENSIONS_DIR/$EXTENSION_NAME"

if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}❌ Extension not found in $TARGET_DIR${NC}"
    echo "Please run ./install.sh first"
    exit 1
fi

echo -e "${GREEN}✅ Extension found${NC}"

# Check required files
required_files=("extension.js" "metadata.json" "prefs.js")
for file in "${required_files[@]}"; do
    if [ -f "$TARGET_DIR/$file" ]; then
        echo -e "${GREEN}✅ $file found${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

# Check schema compilation
if [ -f "$TARGET_DIR/schemas/gschemas.compiled" ]; then
    echo -e "${GREEN}✅ GSettings schema compiled${NC}"
else
    echo -e "${YELLOW}⚠️  GSettings schema not compiled${NC}"
    echo "Run: glib-compile-schemas $TARGET_DIR/schemas/"
fi

# Check if extension is enabled
if gnome-extensions list | grep -q "$EXTENSION_NAME"; then
    echo -e "${GREEN}✅ Extension is installed${NC}"
    
    if gnome-extensions show "$EXTENSION_NAME" | grep -q "State: ENABLED"; then
        echo -e "${GREEN}✅ Extension is enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  Extension is not enabled${NC}"
        echo "Enable with: gnome-extensions enable $EXTENSION_NAME"
    fi
else
    echo -e "${RED}❌ Extension not found in GNOME Extensions${NC}"
    echo "Try restarting GNOME Shell: Alt+F2 → r → Enter"
fi

# Check audio system
echo ""
echo -e "${YELLOW}Audio System Check:${NC}"

if command -v aplay >/dev/null 2>&1; then
    echo -e "${GREEN}✅ aplay found${NC}"
else
    echo -e "${RED}❌ aplay not found${NC}"
    echo "Install with: sudo apt install alsa-utils"
fi

if command -v pactl >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PulseAudio found${NC}"
else
    echo -e "${YELLOW}⚠️  PulseAudio not found (ALSA will be used)${NC}"
fi

# Test silent audio file creation
echo ""
echo -e "${YELLOW}Testing silent audio file creation:${NC}"

if [ -f "$TARGET_DIR/silent.wav" ]; then
    echo -e "${GREEN}✅ Silent audio file exists${NC}"
else
    echo -e "${YELLOW}⚠️  Silent audio file will be created when extension starts${NC}"
fi

echo ""
echo -e "${GREEN}Test completed!${NC}"
echo ""
echo -e "${YELLOW}If all checks pass, the extension should work correctly.${NC}"
echo "Look for a speaker icon in your system tray after enabling the extension." 