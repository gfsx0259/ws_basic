core.apps.gmap_events = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        height: 300,
        events_category_id: "",
        lat: 0,
        lng: 0,
        zoom: 2,

        default_map_type: "map",
        show_map_type_control: 1,
        show_overview_map_control: 1,
        show_pan_control: 1,
        show_zoom_control: 1

    }
    this.map = null;
    this.markers = [];
    this.date = this.getNowDate();
}


core.apps.gmap_events.prototype = {

    
    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.$["content"].innerHTML = "Loading...";
        core.utils.gmap.loadAPI(this.initMap.bind(this));
    },


    initViewMode: function() {
        this.$["map"].style.height = parseInt(this.profile["height"]) + "px";
    },


    // map
    initMap : function(r) {
        var el = this.$["content"];
        if(r.status != "ok") {
            el.innerHTML = r.message;
            return;
        }

        el.innerHTML = "";
        this.displayTpl(el, "gmap_events_content");
        if(core.usertype < USERTYPE_ADMIN) {
            this.initViewMode();
        }


        this.$["content"].style.height = "";
        var el = this.$["map"];
        el.style.height = parseInt(this.profile["height"]) + "px";

        this.map = new google.maps.Map(el);
        this.updateMapControls();

        var p = this.profile;
        this.map.setCenter(new google.maps.LatLng(p.lat, p.lng));
        this.map.setZoom(p.zoom);

        this.geocoder = new google.maps.Geocoder();
        this.callFunction("initAdminGmapInterface");

        this.loadEvents();
    },

  

    updateMapControls: function() {
        if(!this.map) return;

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
    },








    // events

    loadEvents: function() {
        var r = {};
        r.dialog = "calendar";
        r.act =  "get_data";
        if(!core.data.calendar_categories) {
            r.get_categories = "1"
        }
        core.transport.send("/controller.php", r, this.onEventsLoaded.bind(this));
    },


    onEventsLoaded: function(res) {
        if(res && res.status == "data") {
            if(res.categories) {
                core.data.calendar_categories = res.categories;
                this.callFunction("updateCategoriesInput");
            }
            core.data.calendar_events = res.events;
        } else {
            core.data.calendar_events = [];
        }
        this.refresh();
    },




    // events markers

    refresh: function() {
        if(!this.map || !core.data.calendar_events) return;
        this.showElement("navigation");
        this.$["current_date"].innerHTML = this.date.format("M Y");
        this.updateMarkers();
    },



    updateMarkers: function() {
        for(var i=0; i<this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];


        var eventsIdxs = this.getEventsIdxs();

        for(var i=0; i<eventsIdxs.length; i++) {
            var req = {
                address: this.getEventAddr(eventsIdxs[i])
            }
            this.geocoder.geocode(req, this.onGeocoderResponce.bind(this, i));
        }
    },


    onGeocoderResponce: function(eidx, res, status) {
        if(status != google.maps.GeocoderStatus.OK) return;
        this.addMarker(res[0].geometry.location, eidx);
    },


    getEventAddr: function(idx) {
        var e = core.data.calendar_events[idx];
        var addr = e.street;
        if(e.city != "") addr += ", " + e.city;
        if(e.country != "") addr += ", " + e.country;
        if(e.state != "") addr += " " + e.state;
        return addr;
    },



    getEventInfo: function(idx) {
        var e = core.data.calendar_events[idx];
        var eventDate = new Date();
        eventDate.setUnixTime(e.date);

        var when = "";
        if(e.all_day != 1) {
            when += e.time_start_12 + e.time_start_ampm;
            if(e.has_time_end == 1)  {
                when += " - " + e.time_end_12 + e.time_end_ampm;
            }
        }

        when = eventDate.format() + " " + when;

        var addr = this.getEventAddr(idx);
       
        if(e.repeat_mode != "") {
            var r_info = "Repeat every " + e.repeat_period;
            switch(e.repeat_mode) {
                case "d":
                    r_info += " day(s)";
                    break;
                case "w":
                    r_info += " week(s)";
                    var wd = e.repeat_weekdays;
                    if(wd.length > 0) {
                        var wnames = [];
                        for(var i=0; i<wd.length; i++) {
                            wnames.push(core.common.weekdays_short[wd[i]]);
                        }
                        r_info += " on " + wnames.join(", ");
                    }
                    break;
                case "m":
                    r_info += " month(es)";
                    break;
                case "y":
                    r_info += " year(s)";
                    break;
            }
            if(e.repeat_date_end != 0) {
                var d = new Date(e.repeat_date_end * 1000);
                r_info += ", until " + d.format();
            }
            when += "<br/>" + r_info;
        }

        addr += "<br/><a href='http://maps.google.com/maps?daddr=" + escape(addr) + "' target='_blank'>get directions</a>";

        var html = 
            (e.what != "" ? "<div class='event_info_title'>" + e.what + "</div>" : "") +
            "<table>" + 
            this.getEventInfoRow("When:", when) +
            this.getEventInfoRow("Where:", addr) +
            this.getEventInfoRow("Tags:", e.tags) +
            this.getEventInfoRow("Description:", e.description) +
            this.getEventInfoRow("Contact name:", e.contact_name) +
            this.getEventInfoRow("Contact phone:", e.contact_phone) +
            this.getEventInfoRow("Cost:", e.cost) +
            "</table><div style='width:100%;text-align:right'><a href='"+e.more_info+"'>More Info...</a></div>";
           
        return html;
    },


    getEventInfoRow: function(title, value) {
        return value != "" ? "<tr><td style='width: 90px; vertical-align: top'>" + title + "</td><td>" + value + "</tr>" : "";
    },


    addMarker: function(point, idx) {
        var marker = new google.maps.Marker({
            position: point, 
            map: this.map,
            draggable: false
        });


        var w = this;
        google.maps.event.addListener(
            marker, 
            "click",
            this.showEventInfo.bind(this, idx, marker)
        );
        this.markers.push(marker);
    },


    showEventInfo: function(idx, marker) {
        if(!this.info_window) {
            this.info_window = new google.maps.InfoWindow({
                content: "",
                size: new google.maps.Size(Math.min(this.$["map"].offsetWidth - 40, 400), 50)
            })
        } 
        this.info_window.open(this.map, marker);
        var html = this.getEventInfo(idx);
        this.info_window.setContent(html);
    },


    // date navigation

    onNowClick: function() {
        this.date = this.getNowDate();
        this.refresh();
    },


    onPrevClick: function() {
        this.date.setMonth(this.date.getMonth() - 1);
        this.refresh();
    },


    onNextClick: function() {
        this.date.setMonth(this.date.getMonth() + 1);
        this.refresh();
    },



    getNowDate: function() {
        var d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
    },


    // this month events
    getEventsIdxs: function() {
        var res = [];
        var cid = this.profile["events_category_id"];
        var year = this.date.getFullYear();
        var month = this.date.getMonth();

        for(var i=0; i<core.data.calendar_events.length; i++) {
            var ev = core.data.calendar_events[i];

            if(cid != "" && ev.category_id != cid) continue;
            if(ev.city == "" && ev.country == "") continue;

            var eDate = new Date(ev.date * 1000);
            if((month == eDate.getMonth() && year == eDate.getFullYear()) || this.isRecurrence(ev)) {
                res.push(i);
            }
        }
        return res;
    },


    isRecurrence: function(ev) {
        if(ev.repeat_mode == "" || (ev.repeat_mode != "" && ev.date_end < this.date.getUnixTime())) return false;
        var eDate = new Date(ev.date * 1000);
        var eMonth = eDate.getMonth();
        var eYear = eDate.getFullYear();


        if(ev.repeat_mode == "m") {
            for(var i=0; i<ev.repeat_data.length; i++) {
                var rule = ev.repeat_data[i];

                var eventDate = new Date(ev.date * 1000);
                eventDate.setDate(1);
                eventDate.setHours(0,0,0,0);

                while(eventDate <= this.date) {
                    if(eventDate.getUnixTime() == this.date.getUnixTime()) return true;
                    eventDate.setMonth(eventDate.getMonth() + parseInt(rule.args[0]));
                }
            }
            return false;
        }


        var eDate = new Date(ev.date * 1000);
        switch(ev.repeat_mode) {
            case "y":
                var range = this.date.getFullYear() - eYear;
                if((this.date.getMonth() == eMonth) && (range % ev.repeat_period == 0)) return true;
                break;
            case "w":
                var start = eDate;
                var dateUnix = this.date.getUnixTime();
                while(start.getUnixTime() < dateUnix) {
                    start.setDate(start.getDate() + ev.repeat_period * 7);
                }

                var dLast = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
                return (start.getUnixTime() > dateUnix && start.getUnixTime() < dLast.getUnixTime());
                break;
            case "d":
                return true;
                break;
        }
    }


}
core.apps.gmap_events.extendPrototype(core.components.html_component);
core.apps.gmap_events.extendPrototype(core.components.desktop_app);