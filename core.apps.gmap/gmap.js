core.apps.gmap = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        height: 300,
        default_map_type: "map",
        show_map_type_control: 1,
        show_overview_map_control: 1,
        show_pan_control: 1,
        show_zoom_control: 1,
        st_zoom: 3,
        latitude: -30.146,
        longitude: 143.61328,
        m_latitude: "",
        m_longitude: "",
        marker_t: "",
        description_id: "",
        description_type: "content",
        image_path: "",
        show_marker: true
    }
    this.map = {};
    this.countries = {};
    this.marker_desc = "";


}


core.apps.gmap.prototype = {



    onOpen: function() {
        this.setTitle(this.profile["title"]);
        if(core.usertype < USERTYPE_ADMIN) {
            this.initViewMode();
        }
        core.utils.gmap.loadAPI(this.initMap.bind(this));
    },


    initViewMode: function() {
        var el = this.$["content"];
        el.innerHTML = "Loading...";
        el.style.height = parseInt(this.profile["height"]) + "px";
    },



    initMap : function(r) {
        var el = this.$["content"];
        if(r.status != "ok") {
            el.innerHTML = r.message;
            return;
        }
        el.innerHTML = "";

        this.map = new google.maps.Map(el);
        this.refreshMapControls();

        this.map.setCenter(new google.maps.LatLng(this.profile["latitude"], this.profile["longitude"]));
        this.map.setZoom(this.profile["st_zoom"]);

        this.initMarker();

        var w = this;
        if(core.usertype >= USERTYPE_ADMIN) {
            google.maps.event.addListener(this.map, "zoom_changed", 
                function() {
                    var new_zoom = w.map.getZoom();
                    if(w.profile.st_zoom != new_zoom) {
                        w.profile["st_zoom"] = new_zoom;
                        var el = w.$["input_zoom_start"];
                        if(el) el.value = new_zoom;
                        w.saveProfile();
                    }
                });
            google.maps.event.addListener(w.map, "dragend", 
                function() {
                    var center = w.map.getCenter();
                    w.profile["latitude"] = center.lat();
                    w.profile["longitude"] = center.lng();
                    w.saveProfile();
                }
            );
        }
    },



    // markers

    initMarker: function() {
        this.marker = null;
        var p = this.profile;
        if((p["description_id"] !="" || p["image_path"] != "" || p["marker_t"]!="" ) && p["show_marker"]){
            try{
                if(p["m_latitude"] != "" && p["m_longitude"] != ""){
                    var pos = new google.maps.LatLng(p["m_latitude"], p["m_longitude"]);
                } else {
                    var pos = this.map.getCenter();
                }
            } catch(e){
                var pos = this.map.getCenter();
            }
            this.map.setCenter(new google.maps.LatLng(p["latitude"], p["longitude"]));
            this.map.setZoom(p["st_zoom"]);

            this.marker = new google.maps.Marker({
                position: pos, 
                map: this.map,
                title: p["marker_t"], 
                draggable: core.usertype >= USERTYPE_ADMIN
            });
            this.updateMarkerPopup();
        }
    },


    updateMarkerPopup: function() {
        google.maps.event.clearListeners(this.marker, "click");
        google.maps.event.addListener(this.marker, "click", this.loadPopupDoc.bind(this));

        if(core.usertype >= USERTYPE_ADMIN) {
            google.maps.event.clearListeners(this.marker, "dragend");
            var w = this;
            google.maps.event.addListener(this.marker, "dragend", function() {
                var point = w.marker.getPosition();
                w.saveMarker(point);
            });
        }
    },


    loadPopupDoc: function() {
        var doc_id = this.profile["description_id"];
        if(doc_id == "") {
            this.showPopupDoc();
        } else {
            core.data.texts.get(doc_id, this.showPopupDoc.bind(this));
        }
    },


    showPopupDoc: function(doc) {
        var html = '<div>';

        var img = this.profile["image_path"];
        if(img) {
            html += 
                '<img style="float:left;margin:0 10px 10px 0;width:100px;" src="' +
                core.common.getUserFile(img) + 
                '"/>';
        }
        html += (doc ? doc[this.profile.description_type] : "") + '</div>';

        if(!this.info_window) {
            this.info_window = new google.maps.InfoWindow({
                content: "",
                size: new google.maps.Size(Math.min(this.$["content"].offsetWidth - 40, 400), 50)
            })
        }

        this.info_window.open(this.map, this.marker);
        this.info_window.setContent(html);
    },



    delAllMarkers: function() {
        if(this.marker) {
            this.marker.setMap(null);
        }
    },



    saveMarker: function(pos) {
        if(core.usertype < USERTYPE_ADMIN) return;
        this.profile["m_latitude"] = pos.lat();
        this.profile["m_longitude"] = pos.lng();
        this.saveProfile();
    },





    refreshMap: function() {
        this.refreshMapControls();

/*
        var mt = { map: G_NORMAL_MAP, satelite: G_SATELLITE_MAP, hybrid: G_HYBRID_MAP }
        this.map.setMapType(mt[this.profile["default_map_type"]]);
        this.map.setCenter(
            new LatLng(this.profile["latitude"], this.profile["longitude"]), 
            parseInt(this.profile["st_zoom"])
        );
        */
    },




    refreshMapControls: function() {
        this.$["content"].style.height = parseInt(this.profile["height"]) + "px";

        var mt = { 
            map: google.maps.MapTypeId.ROADMAP, 
            satelite: google.maps.MapTypeId.SATELLITE, 
            hybrid: google.maps.MapTypeId.HYBRID
        }

        var m_opts = {
            mapTypeControl: this.profile.show_map_type_control == 1,
            mapTypeId: mt[this.profile.default_map_type],
            streetViewControl: false,
            panControl: this.profile.show_pan_control == 1,
            zoomControl: this.profile.show_zoom_control == 1,
            overviewMapControl: this.profile.show_overview_map_control == 1,
            overviewMapControlOptions: { 
                opened: true
            }
        }
        this.map.setOptions(m_opts);
    }


}
core.apps.gmap.extendPrototype(core.components.html_component);
core.apps.gmap.extendPrototype(core.components.desktop_app);