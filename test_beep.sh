#!/bin/bash

# Test script for notification sound functionality
echo "Testing notification sound functionality..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NOTIFICATION_FILE="$SCRIPT_DIR/notification.mp3"

# Check if notification.mp3 exists
if [ ! -f "$NOTIFICATION_FILE" ]; then
    echo "Error: notification.mp3 file not found at $NOTIFICATION_FILE"
    exit 1
fi

echo "Found notification.mp3 at: $NOTIFICATION_FILE"

# Test with mpv (preferred method)
if command -v mpv &> /dev/null; then
    echo "Testing with mpv..."
    echo "Playing notification sound for 2 seconds..."
    mpv --volume=50 --length=2 --no-video --really-quiet "$NOTIFICATION_FILE"
    
    echo "Playing notification sound for 1 second..."
    mpv --volume=50 --length=1 --no-video --really-quiet "$NOTIFICATION_FILE"
    
    echo "Playing notification sound for 0.5 seconds..."
    mpv --volume=50 --length=0.5 --no-video --really-quiet "$NOTIFICATION_FILE"
else
    echo "mpv not found, trying with aplay..."
    
    # Fallback to aplay
    if command -v aplay &> /dev/null; then
        echo "Playing notification sound with aplay..."
        aplay -q -D pulse "$NOTIFICATION_FILE"
    else
        echo "Error: Neither mpv nor aplay found. Please install mpv: sudo apt install mpv"
        exit 1
    fi
fi

echo "Notification sound tests completed!" 