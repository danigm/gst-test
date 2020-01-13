/* exported Playbin */

const {Gdk, GLib, GObject, Gtk, Gst, Lib} = imports.gi;

var Playbin = GObject.registerClass({
    CssName: 'playbin',
    Signals: {
        clicked: {},
        done: {},
    },
}, class Playbin extends Gtk.Bin {
    _init(props) {
        super._init(props);

        /* Update crop values on size allocation */
        this.connect('size-allocate', (self, alloc) => {
            this._updateCropArea(alloc);
        });
    }

    _ensurePlaybin() {
        if (this._playbin)
            return;

        Gst.init_check(null);

        this._playbin = Gst.parse_launch('playbin3 name=playbin video-sink=gtksink');
        const videoFilter = Gst.parse_bin_from_description(
            'videocrop name=videocrop ! alpha method=green',
            true
        );
        this._videocrop = videoFilter.get_by_name('videocrop');
        this._playbin.set_property('video-filter', videoFilter);

        var videoSink = Lib.property_get_object(this._playbin, 'video-sink');
        this._video_widget = Lib.property_get_object(videoSink, 'widget');
        this._video_widget.expand = true;
        this._video_widget.noShowAll = true;
        this._video_widget.ignoreAlpha = false;
        this._video_widget.show();
        this.add(this._video_widget);
        this.show_all();

        this._playbin.get_bus().add_watch(0, this._bus_watch.bind(this));
    }

    _updateCropArea(alloc) {
        if (!this._videocrop ||
            !this._video_width || !this._video_height ||
            alloc.width < 2 || alloc.height < 2)
            return;

        const crop_x = (this._video_width - alloc.width) / 2;
        const crop_y = (this._video_height - alloc.height) / 2;

        this._videocrop.set_property('left', crop_x);
        this._videocrop.set_property('right', crop_x);
        this._videocrop.set_property('top', crop_y);
        this._videocrop.set_property('bottom', crop_y);
    }

    _onStreamsSelected(msg) {
        const collection = msg.parse_streams_selected();
        const n = collection.get_size();
        let stream = null;

        /* Find video stream */
        for (let i = 0; i < n; i++) {
            stream = collection.get_stream(i);

            if (stream.get_stream_type() === Gst.StreamType.VIDEO)
                break;
        }

        if (!stream)
            return;

        /* Get video size */
        const caps = stream.get_caps();
        const caps_struct = caps.get_structure(0);
        const [width_ok, width] = caps_struct.get_int('width');
        const [height_ok, height] = caps_struct.get_int('height');

        if (width_ok && height_ok) {
            this._video_width = width;
            this._video_height = height;
            this._updateCropArea(this.get_allocation());
        }
    }

    destroy() {
        this.remove(this._video_widget);
        this._uri = null;
        this._playbin = null;
        this._videocrop = null;
        this._video_widget = null;
        this._video_width = 0;
        this._video_height = 0;
    }

    _onEndOfStream() {
        this._playbin.set_state(Gst.State.NULL);
        this.emit('done');
    }

    _onStateChanged(msg) {
        if (this._started)
            return;

        const [, newstate] = msg.parse_state_changed();

        if (newstate === Gst.State.PLAYING) {
            this._started = true;
        }
    }

    _bus_watch(bus, msg) {
        if (msg.type === Gst.MessageType.EOS) {
            if (this._playbin)
                this._onEndOfStream(msg);
            else
                return GLib.SOURCE_REMOVE;
        } else if (msg.type === Gst.MessageType.STREAMS_SELECTED) {
            this._onStreamsSelected(msg);
        } else if (msg.type === Gst.MessageType.STATE_CHANGED) {
            this._onStateChanged(msg);
        }

        return GLib.SOURCE_CONTINUE;
    }

    play() {
        this._ensurePlaybin();
        this._playbin.set_property('uri', 'resource:///com/hack_computer/gst-test/open.webm');
        this._playbin.set_state(Gst.State.PAUSED);
        this._playbin.set_state(Gst.State.PLAYING);
    }
});
