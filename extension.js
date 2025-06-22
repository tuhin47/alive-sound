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
            this.menu.addMenuItem(new imports.ui.popupMenu.PopupMenuItem('Alive Sound Extension'));
            
            // Add separator
            this.menu.addMenuItem(new imports.ui.popupMenu.PopupSeparatorMenuItem());
            
            // Add test notification sound menu item
            const testNotificationItem = new imports.ui.popupMenu.PopupMenuItem('Test Notification Sound');
            testNotificationItem.connect('activate', () => {
                this._playNotificationSound();
            });
            this.menu.addMenuItem(testNotificationItem);

            // Connect settings changes
            this._settings.connect('changed::beep-enabled', () => {
                this._updateNotificationTimer();
            });
            
            this._settings.connect('changed::beep-duration', () => {
                this._updateNotificationTimer();
            });

            // Initialize notification timer
            this._notificationTimer = null;
            this._updateNotificationTimer();
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

        _updateNotificationTimer() {
            // Clear existing timer
            if (this._notificationTimer) {
                GLib.source_remove(this._notificationTimer);
                this._notificationTimer = null;
            }

            // Start new timer if notification sound is enabled
            if (this._settings.get_boolean('beep-enabled')) {
                const interval = this._settings.get_int('beep-duration');
                // Play notification every X seconds when enabled (X = interval setting)
                this._notificationTimer = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, interval, () => {
                    this._playNotificationSound();
                    return true; // Continue the timer
                });
            }
        }

        destroy() {
            if (this._notificationTimer) {
                GLib.source_remove(this._notificationTimer);
                this._notificationTimer = null;
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