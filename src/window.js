/* window.js
 *
 * Copyright 2020 Daniel García Moreno
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const { GObject, Gtk } = imports.gi;
const {Playbin} = imports.playbin;

var GstTestWindow = GObject.registerClass({
    GTypeName: 'GstTestWindow',
    Template: 'resource:///com/hack_computer/gst-test/window.ui',
    InternalChildren: ['label', 'box']
}, class GstTestWindow extends Gtk.ApplicationWindow {
    _init(application) {
        super._init({ application });
        this._playbin = new Playbin();
        this._playbin.show_all();
        this._box.add(this._playbin);
        this._playbin.play();

        this._css_provider = new Gtk.CssProvider();
        this.get_style_context().add_provider(
            this._css_provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        );

        try {
            this._css_provider.load_from_data(`
window {
    background: transparent;
    transition: background 1s ease;
}`
            );
        } catch (e) {
            logError(e, 'Failed to load css');
        }
    }
});

