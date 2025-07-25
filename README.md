# Alive Sound - GNOME Extension

A GNOME Shell extension that generates silent sound to keep your Bluetooth devices active and prevent them from turning off automatically.

## Features

- **Silent Sound Generation**: Creates a very low-volume 2-second audio stream that keeps your Bluetooth audio devices active
- **Configurable Intervals**: Set custom intervals for both sound generation and notification sounds
- **Notification Sound Option**: Optional periodic notification sounds using the included MP3 file
- **Easy Toggle**: Simple on/off switch in the system tray
- **Volume Control**: Adjustable volume level (default: very low to be inaudible)
- **Interval Control**: Text input fields to set both sound generation and notification intervals in seconds
- **Test Notification Function**: Test notification sounds directly from the extension menu
- **Automatic Startup**: Remembers your settings and starts automatically if enabled
- **System Integration**: Clean integration with GNOME Shell
- **Multiple Sound Generation Methods**: Uses sox, ffmpeg, or speaker-test for maximum compatibility

## Installation

### Method 1: Manual Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/tuhin47/alive-sound.git
   cd alive-sound
   ```

2. Copy the extension to your GNOME extensions directory:
   ```bash
   cp -r . ~/.local/share/gnome-shell/extensions/alive-sound@tuhintowhidul9@gmail.com
   ```

3. Compile the GSettings schema:
   ```bash
   cd ~/.local/share/gnome-shell/extensions/alive-sound@tuhintowhidul9@gmail.com
   glib-compile-schemas schemas/
   ```

4. Restart GNOME Shell:
   - Press `Alt+F2`, type `r`, and press Enter
   - Or log out and log back in

5. Enable the extension:
   - Open GNOME Extensions app
   - Find "Alive Sound" and toggle it on
   - Or use: `gnome-extensions enable alive-sound@tuhintowhidul9@gmail.com`

### Method 2: Using GNOME Extensions Website

1. Visit [extensions.gnome.org](https://extensions.gnome.org)
2. Search for "Alive Sound"
3. Click "Install" and follow the instructions

## Usage

1. **Enable the Extension**: The extension will appear as a speaker icon in your system tray
2. **Toggle Sound Generation**: Click the speaker icon and toggle "Enable Sound Generation"
3. **Adjust Volume**: Use the volume slider to set the sound level (keep it very low for silence)
4. **Set Sound Generation Interval**: Enter the desired interval in seconds for sound generation (e.g., 30 for every 30 seconds)
5. **Enable Notification Sound**: Toggle the notification sound option in settings
6. **Set Notification Interval**: Enter the desired interval in seconds for notifications (e.g., 160 for every 160 seconds)
7. **Test Notification**: Use the "Test Notification Sound" menu item to test the notification functionality
8. **Settings**: Access additional settings through the menu

## How It Works

The extension creates a silent or very low-volume 2-second audio stream that:
- Keeps your Bluetooth audio devices active
- Prevents automatic disconnection due to inactivity
- Uses minimal system resources
- Is virtually inaudible when volume is set low
- Can be configured to play at custom intervals (default: 30 seconds)

**Sound Generation Feature:**
- Generates a 2-second silent sound at specified intervals when enabled
- Uses multiple methods for maximum compatibility: sox (primary), ffmpeg (fallback), speaker-test (last resort)
- Interval can be set in seconds using a text input field (default: 30 seconds)
- Volume control affects the generated sound level

**Notification Sound Feature:**
- Plays the included `notification.mp3` file at specified intervals when enabled
- Interval can be set in seconds using a text input field (default: 160 seconds)
- Uses mpv media player for optimal MP3 playback with volume control
- Falls back to aplay if mpv is not available
- Can be tested manually through the extension menu

## Requirements

- GNOME Shell 40 or later
- ALSA or PulseAudio sound system
- `mpv` media player (recommended) or `aplay` command
- `sox` (recommended), `ffmpeg`, or `speaker-test` for sound generation
- `notification.mp3` file included with the extension

## Dependencies

Install required dependencies:
```bash
# For Ubuntu/Debian
sudo apt install mpv alsa-utils sox ffmpeg

# For Fedora
sudo dnf install mpv alsa-utils sox ffmpeg

# For Arch Linux
sudo pacman -S mpv alsa-utils sox ffmpeg
```

## Troubleshooting

### Extension Not Appearing
- Make sure the extension is enabled in GNOME Extensions
- Check that the schema is compiled: `glib-compile-schemas schemas/`
- Restart GNOME Shell: `Alt+F2` → `r` → Enter

### No Sound Playing
- Check if `mpv` is available: `which mpv`
- Install mpv: `sudo apt install mpv`
- Check if `aplay` is available as fallback: `which aplay`
- Install ALSA utilities: `sudo apt install alsa-utils`
- Check audio permissions and volume settings

### Sound Generation Not Working
- Check if `sox` is available: `which sox`
- Install sox: `sudo apt install sox`
- Check if `ffmpeg` is available as fallback: `which ffmpeg`
- Install ffmpeg: `sudo apt install ffmpeg`
- Check if `speaker-test` is available as last resort: `which speaker-test`
- Install ALSA utilities: `sudo apt install alsa-utils`
- Test sound generation: `./test_sound_generation.sh`
- Ensure the sound generation interval is set to a valid number greater than 0

### Notification Sound Not Working
- Test the notification functionality using the "Test Notification Sound" menu item
- Run the test script: `./test_beep.sh`
- Check if the `notification.mp3` file exists in the extension directory
- Ensure mpv or aplay is installed and working
- Check if your audio system supports MP3 playback
- Verify the interval setting is a valid number greater than 0

### Bluetooth Still Disconnects
- Ensure the volume is not set to 0
- Check that your Bluetooth device is set as the default audio output
- Some devices may have their own power management settings

## Configuration

The extension stores settings in GSettings under `org.gnome.shell.extensions.alive-sound`:

- `enabled`: Boolean - Whether sound generation is enabled
- `volume`: Double - Volume level (0.0 to 1.0)
- `sound-interval`: Integer - Sound generation interval in seconds (default: 30)
- `beep-enabled`: Boolean - Whether notification sound is enabled
- `beep-duration`: Integer - Notification interval in seconds (default: 160)

You can modify these using:
```bash
gsettings set org.gnome.shell.extensions.alive-sound enabled true
gsettings set org.gnome.shell.extensions.alive-sound volume 0.01
gsettings set org.gnome.shell.extensions.alive-sound sound-interval 30
gsettings set org.gnome.shell.extensions.alive-sound beep-enabled true
gsettings set org.gnome.shell.extensions.alive-sound beep-duration 160
```

## Development

### Building from Source

1. Install development dependencies:
   ```bash
   sudo apt install gettext libglib2.0-dev mpv alsa-utils sox ffmpeg
   ```

2. Compile the schema:
   ```bash
   glib-compile-schemas schemas/
   ```

3. Test the extension:
   ```bash
   gnome-extensions enable alive-sound@tuhintowhidul9@gmail.com
   ```

4. Test notification functionality:
   ```bash
   ./test_beep.sh
   ```

5. Test sound generation functionality:
   ```bash
   ./test_sound_generation.sh
   ```

### File Structure

```
alive-sound/
├── extension.js          # Main extension code
├── prefs.js             # Preferences window
├── metadata.json        # Extension metadata
├── notification.mp3     # Notification sound file (2 seconds)
├── schemas/             # GSettings schemas
│   └── org.gnome.shell.extensions.alive-sound.gschema.xml
├── test_beep.sh         # Notification sound test script
├── test_sound_generation.sh  # Sound generation test script
└── README.md           # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter issues or have questions:
- Check the troubleshooting section above
- Open an issue on GitHub
- Check the GNOME Extensions documentation

## Acknowledgments

- GNOME Shell extension developers
- ALSA and PulseAudio communities
- GNOME Extensions community 