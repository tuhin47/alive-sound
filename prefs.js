const { GObject, Gtk, Gio } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

const AliveSoundPrefsWidget = GObject.registerClass(
    class AliveSoundPrefsWidget extends Gtk.Box {
        _init(params) {
            super._init(params);

            this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.alive-sound');

            this.orientation = Gtk.Orientation.VERTICAL;
            this.spacing = 18;
            this.margin_top = 18;
            this.margin_bottom = 18;
            this.margin_start = 18;
            this.margin_end = 18;

            this._createWidgets();
            this._loadSettings();
        }

        _createWidgets() {
            // Title
            const titleLabel = new Gtk.Label({
                label: '<b>Alive Sound Settings</b>',
                use_markup: true,
                halign: Gtk.Align.START
            });
            this.append(titleLabel);

            // Description
            const descLabel = new Gtk.Label({
                label: 'This extension generates silent sound to keep your Bluetooth devices active and prevent them from turning off automatically.',
                wrap: true,
                halign: Gtk.Align.START
            });
            this.append(descLabel);

            // Separator
            const separator = new Gtk.Separator({
                orientation: Gtk.Orientation.HORIZONTAL
            });
            this.append(separator);

            // Enable notification sound switch
            const notificationEnableBox = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 12
            });
            const notificationEnableLabel = new Gtk.Label({
                label: 'Enable notification sound',
                halign: Gtk.Align.START,
                hexpand: true
            });
            this._beepEnableSwitch = new Gtk.Switch({
                halign: Gtk.Align.END
            });
            notificationEnableBox.append(notificationEnableLabel);
            notificationEnableBox.append(this._beepEnableSwitch);
            this.append(notificationEnableBox);

            // Volume adjustment
            const volumeBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 6
            });
            const volumeLabel = new Gtk.Label({
                label: 'Volume',
                halign: Gtk.Align.START
            });
            this._volumeScale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL,
                adjustment: new Gtk.Adjustment({
                    lower: 0.0,
                    upper: 1.0,
                    step_increment: 0.01,
                    page_increment: 0.1
                }),
                digits: 2,
                value_pos: Gtk.PositionType.RIGHT
            });
            volumeBox.append(volumeLabel);
            volumeBox.append(this._volumeScale);
            this.append(volumeBox);

            // Interval input
            const intervalBox = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 12
            });
            const intervalLabel = new Gtk.Label({
                label: 'Interval (seconds)',
                halign: Gtk.Align.START,
                hexpand: true
            });
            this._intervalEntry = new Gtk.Entry({
                text: '30',
                width_chars: 10,
                halign: Gtk.Align.END
            });
            intervalBox.append(intervalLabel);
            intervalBox.append(this._intervalEntry);
            this.append(intervalBox);

            // Info label
            const infoLabel = new Gtk.Label({
                label: 'The notification sound will play every X seconds when enabled. The sound file is approximately 2 seconds long.',
                wrap: true,
                halign: Gtk.Align.START
            });
            this.append(infoLabel);

            // Connect signals
            this._beepEnableSwitch.connect('state-set', (widget, state) => {
                this._settings.set_boolean('beep-enabled', state);
            });
            this._volumeScale.connect('value-changed', (widget) => {
                this._settings.set_double('volume', widget.get_value());
            });
            this._intervalEntry.connect('changed', (widget) => {
                const value = parseFloat(widget.get_text());
                if (!isNaN(value) && value > 0) {
                    this._settings.set_int('interval', Math.floor(value));
                }
            });
        }

        _loadSettings() {
            this._beepEnableSwitch.set_active(this._settings.get_boolean('beep-enabled'));
            this._volumeScale.set_value(this._settings.get_double('volume'));
            this._intervalEntry.set_text(this._settings.get_int('interval').toString());
        }
    }
);

function buildPrefsWidget() {
    return new AliveSoundPrefsWidget();
}

function init() {
    // No initialization needed
} 