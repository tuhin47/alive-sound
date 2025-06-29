const { GObject, St, Gio, GLib } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;

const AliveSoundIndicator = GObject.registerClass(
    class AliveSoundIndicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, 'Alive Sound');

            this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.alive-sound');

            // Create indicator icon
            this.add_child(new St.Icon({
                icon_name: 'audio-speakers-symbolic',
                style_class: 'system-status-icon',
            }));

            // Add menu items
            const settingsItem = new imports.ui.popupMenu.PopupMenuItem('Alive Sound Extension');
            settingsItem.connect('activate', () => {
                this._openSettings();
            });
            this.menu.addMenuItem(settingsItem);
            
            // Add separator
            this.menu.addMenuItem(new imports.ui.popupMenu.PopupSeparatorMenuItem());
            
            // Add Enable Notification Sound toggle
            this._enableNotificationItem = new imports.ui.popupMenu.PopupSwitchMenuItem('Enable Notification Sound', false);
            this._enableNotificationItem.connect('toggled', (item) => {
                this._settings.set_boolean('beep-enabled', item.state);
            });
            this.menu.addMenuItem(this._enableNotificationItem);

            // Connect settings changes
            this._settings.connect('changed::beep-enabled', () => {
                this._enableNotificationItem.setToggleState(this._settings.get_boolean('beep-enabled'));
                this._updateTimer();
            });
            this._settings.connect('changed::interval', () => {
                this._updateTimer();
            });
            this._settings.connect('changed::volume', () => {
                // No timer update needed, but could be used if needed
            });

            // Initialize timer
            this._timer = null;
            this._updateTimer();
            
            // Load initial states
            this._enableNotificationItem.setToggleState(this._settings.get_boolean('beep-enabled'));
        }

        _openSettings() {
            try {
                // Open the extension preferences using GNOME's extension preferences command
                const uuid = ExtensionUtils.getCurrentExtension().metadata.uuid;
                imports.misc.util.trySpawnCommandLine(`gnome-extensions prefs ${uuid}`);
            } catch (error) {
                log('Alive Sound: Failed to open settings: ' + error.message);
            }
        }

        _playNotificationSound() {
            const volume = this._settings.get_double('volume');
            
            try {
                // Get the extension directory path
                const extensionDir = ExtensionUtils.getCurrentExtension().dir.get_path();
                const notificationFile = GLib.build_filenamev([extensionDir, 'notification.mp3']);
                
                // Check if the file exists
                const file = Gio.File.new_for_path(notificationFile);
                if (!file.query_exists(null)) {
                    log('Alive Sound: notification.mp3 file not found at ' + notificationFile);
                    return;
                }
                
                // Use mpv to play the full notification sound with volume control
                const volumePercent = Math.floor(volume * 100);
                const playCommand = `mpv --volume=${volumePercent} --no-video --really-quiet "${notificationFile}"`;
                
                imports.misc.util.trySpawnCommandLine(playCommand);
            } catch (error) {
                log('Alive Sound: Failed to play notification sound: ' + error.message);
                
                // Fallback to aplay if mpv is not available
                try {
                    const fallbackCommand = `aplay -q -D pulse "${notificationFile}"`;
                    imports.misc.util.trySpawnCommandLine(fallbackCommand);
                } catch (fallbackError) {
                    log('Alive Sound: Fallback also failed: ' + fallbackError.message);
                }
            }
        }

        _updateTimer() {
            // Clear existing timer
            if (this._timer) {
                GLib.source_remove(this._timer);
                this._timer = null;
            }
            const interval = this._settings.get_int('interval');
            if (this._settings.get_boolean('beep-enabled')) {
                // Notification mode
                this._timer = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, interval, () => {
                    this._playNotificationSound();
                    return true;
                });
            }
        }

        destroy() {
            if (this._timer) {
                GLib.source_remove(this._timer);
                this._timer = null;
            }
            super.destroy();
        }
    }
);

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
        this._indicator = null;
    }

    enable() {
        this._indicator = new AliveSoundIndicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}

function init() {
    return new Extension(ExtensionUtils.getCurrentExtension().metadata.uuid);
} 