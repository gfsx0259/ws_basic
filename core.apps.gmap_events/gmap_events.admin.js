core.apps.gmap_events.extendPrototype({


    resize_params: {
        target_element: "map"
    },


    settingsBlocks: [

        { title: "Events category:",
          controls: [
            { tag: "wsc_select", id: "inp_events_category_id", 
              options: [
                { text: "Loading...", value: "l" }
              ]}
          ]},


        { title: "Map controls:",
          controls: [
            { tag: "wsc_select", id: "input_def_map_type", 
              options: [
                { text: "Map Type - <strong>Map</strong>", value: "map" },
                { text: "Map Type - <strong>Satelite</strong>", value: "satelite" },
                { text: "Map Type - <strong>Hybrid</strong>", value: "hybrid" }
              ]},
            { tag: "div", className: "divider" },
            { tag: "wsc_checkbox", title: "Show 'Map type' controls", id: "ch_show_map_type_control" },
            { tag: "div", className: "divider" },
            { tag: "wsc_checkbox", title: "Show Overview map", id: "ch_show_overview_map_control" },
            { tag: "div", className: "divider" },
            { tag: "wsc_checkbox", title: "Show Pan control", id: "ch_show_pan_control" },
            { tag: "div", className: "divider" },
            { tag: "wsc_checkbox", title: "Show Zoom control", id: "ch_show_zoom_control" },
            { tag: "div", className: "divider" }
          ]}
    ],


    onSettingsRendered: function() {
         this.updateCategoriesInput();
    },

    // settings

    fillSettingsForm: function() {
        this.$["inp_events_category_id"].setValue(this.profile["events_category_id"]);

        this.$["input_def_map_type"].setValue(this.profile["default_map_type"]);
        this.$["ch_show_map_type_control"].setChecked(this.profile["show_map_type_control"]);
        this.$["ch_show_overview_map_control"].setChecked(this.profile["show_overview_map_control"]);
        this.$["ch_show_pan_control"].setChecked(this.profile["show_pan_control"]);
        this.$["ch_show_zoom_control"].setChecked(this.profile["show_zoom_control"]);
    },


    processSettingsForm: function() {
        var cid = this.$["inp_events_category_id"].value;
        if(cid != "l") {
            this.profile["events_category_id"] = cid;
        }

        this.profile["show_map_type_control"] = this.$["ch_show_map_type_control"].checked ? 1 : 0;
        this.profile["show_overview_map_control"] = this.$["ch_show_overview_map_control"].checked ? 1 : 0;
        this.profile["show_pan_control"] = this.$["ch_show_pan_control"].checked ? 1 : 0;
        this.profile["show_zoom_control"] = this.$["ch_show_zoom_control"].checked ? 1 : 0;
    },

    onSettingsUpdated: function() {
        this.updateMapControls();
        this.updateMarkers();
    },


    // events categories input
    updateCategoriesInput: function() {
        if(!this.isSettingsRendered) return;

        var el = this.$["inp_events_category_id"];
        var opts = [ { text: "None", value: "" } ];
        if(core.data.calendar_categories) {
            var cats = core.data.calendar_categories;
            for(var id in cats) {
                opts.push({ text: cats[id].title, value: id });
            }
        }
        el.setOptions(opts);
        el.setValue(this.profile["events_category_id"]);
    },


    //gmap
    initAdminGmapInterface: function() {
        google.maps.event.addListener(this.map, "zoom_changed", 
            this.onGmapZoonEnd.bind(this)
        );
        google.maps.event.addListener(this.map, "dragend", 
            this.onGmapMoveEnd.bind(this)
        );
    },


    onGmapZoonEnd: function() {
        this.hideSettings();
        var new_zoom = this.map.getZoom();
        if(this.profile.zoom != new_zoom) {
            this.profile["zoom"] = new_zoom;
            this.saveProfile();
        }
    },


    onGmapMoveEnd: function() {
        var center = this.map.getCenter();
        this.profile["lat"] = center.lat();
        this.profile["lng"] = center.lng();
        this.saveProfile();
    }
    

});