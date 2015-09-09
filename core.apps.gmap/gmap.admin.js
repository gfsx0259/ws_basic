core.apps.gmap.extendPrototype({

    resize_params: {
        target_element: "content"
    },


    onFirstRun: function() {
        this.showSettings();
    },


    settingsBlocks: [
        { title: "Height:", 
          controls: [
            { tag: "wsc_size", hide: "w",
              id: "inp_height" }
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
          ]},

        { title: "Find address:",
          controls: [
            { tag: "div", className: "find_address",
              childs: [
                { tag: "wsc_button", title: "Find", events: { onclick: "onFindAddrClick" }},
                { tag: "wsc_text", id: "inp_addr", hint: "street, suburb/town, state/province, country..." }
              ]}
          ]},

      
        { title: "Map marker:", 
          controls: [
            { tag: "wsc_checkbox", title: "Show marker", id: "ch_show_marker" },
            { tag: "div", className: "divider" },
            { tag: "wsc_text", id: "marker_title", hint: "marker title..." },

            { tag: "div", className: "divider" },
            { tag: "text", innerHTML: "Description:" },
            { tag: "wsc_doc_control", id: "inp_doc" },

            { tag: "div", className: "divider" },
            { tag: "text", innerHTML: "Picture:" },
            { tag: "wsc_file", type: "pictures", id: "inp_image" }

          ]}
    ],

        show_pan_control: true,
        show_zoom_control: true,

    // settings

    fillSettingsForm: function() {
        this.$["inp_height"].setValue({ height: this.profile["height"]});

        this.$["input_def_map_type"].setValue(this.profile["default_map_type"]);
        this.$["ch_show_map_type_control"].setChecked(this.profile["show_map_type_control"]);
        this.$["ch_show_overview_map_control"].setChecked(this.profile["show_overview_map_control"]);
        this.$["ch_show_pan_control"].setChecked(this.profile["show_pan_control"]);
        this.$["ch_show_zoom_control"].setChecked(this.profile["show_zoom_control"]);

        this.$["ch_show_marker"].setChecked(this.profile["show_marker"]);

        this.$["marker_title"].setValue(this.profile["marker_t"]);

        this.$["inp_image"].setValue(this.profile["image_path"]);
        this.$["inp_doc"].setValue({ id: this.profile.description_id || null, content: this.profile.description_type });
    },


    processSettingsForm: function() {
        this.profile["height"] = this.$["inp_height"].value.height;

        this.profile["default_map_type"] = this.$["input_def_map_type"].value;

        this.profile["show_map_type_control"] = this.$["ch_show_map_type_control"].checked ? 1 : 0;
        this.profile["show_overview_map_control"] = this.$["ch_show_overview_map_control"].checked ? 1 : 0;
        this.profile["show_pan_control"] = this.$["ch_show_pan_control"].checked ? 1 : 0;
        this.profile["show_zoom_control"] = this.$["ch_show_zoom_control"].checked ? 1 : 0;

        this.profile["show_marker"] = this.$["ch_show_marker"].checked ? 1 : 0;
        this.profile["marker_t"] = this.$["marker_title"].getValue();
        this.profile["image_path"] = this.$["inp_image"].value;
        var d = this.$["inp_doc"].value;
        this.profile.description_id = d.id;
        this.profile.description_type = d.content;

        if(this.profile["show_marker"]==1) {
            this.delAllMarkers();
            this.initMarker();
        }
    },



    onSetMarker: function() {
        var bounds = this.map.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        var lngSpan = northEast.lng() - southWest.lng();
        var latSpan = northEast.lat() - southWest.lat();
        var point = new GLatLng(southWest.lat() + latSpan/2, southWest.lng() + lngSpan/2);
        var marker = new GMarker(point);
        marker.value = 747;
        this.map.addOverlay(marker);
    },


    onSettingsUpdated: function() {
        if(!this.map) return;

        this.refreshMap();

        if(this.profile["show_marker"]){
            this.initMarker();
        } else {
            this.delAllMarkers();
        }
    },



    // find addr
    onFindAddrClick: function() {
        var req = {
            address: this.$["inp_addr"].getValue()
        };
        if(!req.address) return;

        if(!this.geocoder)
            this.geocoder = new google.maps.Geocoder();

        var w = this;
        this.geocoder.geocode(req, 
            function(res, status) {
                if(status != google.maps.GeocoderStatus.OK) {
                    desktop.modal_dialog.alert(req.address + " not found");
                } else {
                    var r = res[0];
                    w.map.setCenter(res[0].geometry.location, parseInt(w.profile["st_zoom"]));
                    w.initMarker();
                }
            }
        );
    }


});