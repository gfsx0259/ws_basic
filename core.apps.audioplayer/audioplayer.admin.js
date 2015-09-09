core.apps.audioplayer.extendPrototype({


    onFirstRun: function () {
        this.showSettings();
        this.openPlaylistManager(true);
    },


    settingsBlocks: [

        {
            title: "Size:",
            controls: [
                {tag: "wsc_size", id: "inp_size"},
                {tag: "div", html: "(Height ignored when playlist is hidden) "}
            ]
        },


        {
            title: "Show loading",
            controls: [
                {
                    tag: "wsc_select",
                    id: "inp_showloading",
                    options: [
                        {value: "autohide", text: "Autohide"},
                        {value: "always", text: "Always"},
                        {value: "never", text: "Never"}
                    ]
                }
            ]
        },
        {
            title: "Misc:",
            controls: [
                {
                    tag: "wsc_checkbox", title: "Show playlist",
                    id: "inp_showlist"
                },
                {tag: "div", className: "divider"},
                {
                    tag: "wsc_checkbox", title: "Show volume",
                    id: "inp_showvolume"
                },
                {tag: "div", className: "divider"},
                {
                    tag: "wsc_checkbox", title: "Autoplay",
                    id: "inp_autoplay"
                },
                {tag: "div", className: "divider"},
                {
                    tag: "wsc_checkbox", title: "Loop",
                    id: "inp_loop"
                }
            ]
        },

        {
            title: "Playlist:",
            controls: [
                {
                    tag: "a", events: {onclick: "openPlaylistManager"},
                    html: "Manage playlist"
                }
            ]
        }
    ],

    fillSettingsForm: function () {
        this.$["inp_showlist"].setChecked(this.profile["showlist"]);
        this.$["inp_showvolume"].setChecked(this.profile["showvolume"]);
        this.$["inp_autoplay"].setChecked(this.profile["autoplay"]);
        this.$["inp_loop"].setChecked(this.profile["loop"]);
        this.$["inp_showloading"].setValue(this.profile["showloading"]);

        this.$["inp_size"].setValue(this.profile);
    },

    processSettingsForm: function () {
        this.profile["showlist"] = this.$["inp_showlist"].checked ? 1 : 0;
        this.profile["showvolume"] = this.$["inp_showvolume"].checked ? 1 : 0;
        this.profile["loop"] = this.$["inp_loop"].checked ? 1 : 0;
        this.profile["autoplay"] = this.$["inp_autoplay"].checked ? 1 : 0;

        var s = this.$["inp_size"].value;
        this.profile["width"] = s.width || this.defaultProfile["width"];
        this.profile["height"] = s.height || this.defaultProfile["height"];

        this.profile["showloading"] = this.$["inp_showloading"].value;
    },


    onSettingsUpdated: function () {
        this.render();
    },


    // edit playlist

    openPlaylistManager: function (flag) {
        var p = this.profile;
        var list = [];
        for (var i = 0; i < p.titles.length; i++) {
            list.push({
                title: p.titles[i],
                file: p.tracks[i]
            });
        }

        core.values.list_editor = {
            popup_title: "Playlist",
            list: list,
            callback: this.onPlaylistChanged.bind(this),
            add_action: "select_file",
            auto_add: flag === true,
            default_item: {
                title: "Track",
                file: ""
            },
            labels: {
                title: "Title:",
                file: "Track:"
            },
            add_action: "select_file",
            files_filter: "audio"
        };
        desktop.showPopupApp("list_editor");
    },


    onPlaylistChanged: function (list) {
        var p = this.profile;
        p.titles = [];
        p.tracks = [];
        for (var i = 0; i < list.length; i++) {
            p.titles[i] = list[i].title;
            p.tracks[i] = list[i].file;
        }
    }

});