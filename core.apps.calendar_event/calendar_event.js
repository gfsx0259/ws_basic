core.apps.calendar_event = function() {
    this.needCategoriesRefresh = true;

    this.currentDate = new Date();
    this.currentEndDate = new Date();
    this.eventIdx = null;
    this.event = {};
    this.whatEmpty = "(No Subject)";
}


core.apps.calendar_event.prototype = {

    window_resize: {
        target: "calendar_manager_content"
    },

    defaultEventData: {
        id: null,
        all_day: 0,
        time_start_12: "12:00",
        time_start_ampm: "am",
        time_end_12: "8:30",
        time_end_ampm: "pm",
        has_time_end: 1,
        what: "(No Subject)",
        contact_name: "",
        contact_phone: "",
        rsvp_date: 0,
        cost: "",
        street: "",
        city: "",
        state: "",
        country: "",
        tags: "",
        description: "",
        date: new Date().getUnixTime(),

        repeat_mode: "",
        offset: 0,
        repeat_data: [],
        repeat_period: 1,
        repeat_date_end: 0,
        repeat_weekdays: []
    },


    timesList: [
        "12:00", "3:00", "6:00", "9:00", 
        "12:30", "3:30", "6:30", "9:30", 
        "1:00",  "4:00", "7:00", "10:00",
        "1:30",  "4:30", "7:30", "10:30",
        "2:00",  "5:00", "8:00", "11:00",
        "2:30",  "5:30", "8:30", "11:30" 
    ],

    getTitle: function() {
        return "Edit event details";
    },


    onShowContent:function() {
        var d = core.values.calendar_event_data;
        if(d) {
            this.setData(d);
            core.values.calendar_event_data = null;
        }
        // update categories select
        if(this.needCategoriesRefresh) {
            this.renderCategoriesSelect();
            this.needCategoriesRefresh = false;
        }
    },


    renderCategoriesSelect: function() {
        var cats = core.data.calendar_categories;
        var opts = [ { text: "No category", value: "0" } ];
        for(var id in cats) {
            opts.push({ text: cats[id].title, value: id });
        }
        this.$["inp_category_id"].setOptions(opts);
    },


    renderContent: function() {
        core.data.calendar_event = [];
        this.displayTpl(this.$["content"], "calendar_event_edit");

        var opts = [];
        for(var i = 1; i<12;i++) {
            opts.push({ text: i, value: i});
        }
        this.$["r_sel_monthes1"].setOptions(opts);
        this.$["r_sel_monthes2"].setOptions(opts);
        this.$["r_sel_monthes3"].setOptions(opts);
        this.$["r_sel_monthes5"].setOptions(opts);
        for(var i = 12; i<31;i++) {
            opts.push({ text: i, value: i});
        }
        this.$["r_sel_days"].setOptions(opts);

        var opts = [{ text: "No More Info", value: ""}];
        for(var i=0; i<core.data.pages_list.length; i++) {
            var p = core.data.pages_list[i];
            if(p.type == "std") {
                opts.push({ text: p.name, value: p.url });
            }
        }
        this.$["inp_more_info_page"].setOptions(opts);
    },


    setData: function(data) {
        if(data.eventIdx != undefined) {
            // edit event event
            this.eventIdx = data.eventIdx;
            this.event = clone(core.data.calendar_events[this.eventIdx]);
            this.currentDate.setUnixTime(this.event.date);
        } else {
            // new event
            this.currentDate.setUnixTime(data.date);
            this.eventIdx = null;
            this.event = clone(this.defaultEventData);
        }

        this.renderCategoriesSelect();
        this.needCategoriesRefresh = false;
        this.fillForm();
    },



    fillForm: function() {
        var day   = this.currentDate.getDate();
        var month = this.currentDate.getMonth();
        var year  = this.currentDate.getYear()% 1900 + 1900;
        var minutes = this.currentDate.getMinutes();
        var time =  this.currentDate.getHours() + ":" + (minutes < 10 ? "0"+minutes: minutes);

        var ev = this.event;

        this.$["div_date"].innerHTML = this.currentDate.toDateString();
        this.$["inp_date"].value = year+"/"+(month+1)+"/"+day;

        this.$["inp_all_day"].setChecked(ev.all_day == 1);
        this.$["inp_has_time_end"].setChecked(ev.has_time_end == 1);
        this.updateTimeInputs();

        this.$["inp_time_start"].value = ev.time_start_12;
        this.$["inp_time_start_ampm"].setValue(ev.time_start_ampm);


        this.$["inp_time_end"].value = ev.time_end_12;
        this.$["inp_time_end_ampm"].setValue(ev.time_end_ampm);

        this.$["inp_category_id"].setValue(ev.category_id);

        this.$["inp_what"].value = ev.what != this.whatEmpty ? ev.what : "";

        this.$["inp_street"].value = ev.street;
        this.$["inp_city"].value = ev.city;
        this.$["inp_state"].value = ev.state;
        this.$["inp_country"].value = ev.country;

        this.$["inp_tags"].value = ev.tags;
        this.$["inp_description"].value = ev.description.replace(/<br\s*\/?>/mg,"\n");

        this.$["inp_contact_name"].value = ev.contact_name;
        this.$["inp_contact_phone"].value = ev.contact_phone;
        this.$["inp_rsvp_date"].value = ev.rsvp_date;

        this.$["inp_more_info_page"].setValue(ev.more_info);

        if(ev.rsvp_date != 0) {
            var d = new Date(ev.rsvp_date * 1000);
            this.$["div_rsvp_date"].innerHTML = d.format(core.config.formats["date"]);
        } else {
            this.$["div_rsvp_date"].innerHTML = "";
        }
        this.$["inp_cost"].value = ev.cost;

        if(this.eventIdx != null) {
            this.showElement("btn_delete");
            this.setSaveBtnState("save");
        } else {
            this.hideElement("btn_delete");
            this.setSaveBtnState("add");
        }
        this.$["rad_rec"].setValue(ev.repeat_mode);
        this.onRecTypeChanged();
        this.setRecData(ev);
    },


    // s: "save" | "add"
    setSaveBtnState: function(s) {
        if(s == "save") {
            this.$["btn_save"].setTitle("Save");
        } else if(s == "add") {
            this.$["btn_save"].setTitle("Add");
        }
    },



    getEventData: function() {
        return this.event;
    },



    onSaveClick: function() {

        var all_day = this.$["inp_all_day"].checked ? 1 : 0;
        var has_time_end = this.$["inp_has_time_end"].checked ? 1 : 0;

        var time_start_12 = this.$["inp_time_start"].value;
        var time_end_12 = this.$["inp_time_end"].value;
        var time_start_ampm = this.$["inp_time_start_ampm"].value;
        var time_end_ampm = this.$["inp_time_end_ampm"].value;

        if(!all_day) {
            if(has_time_end && !this.validateTimeAll(time_start_12,time_end_12,time_start_ampm,time_end_ampm)) {
                return false;
            }
        } else {
            time_start_12 = "12:00";
            time_start_ampm = "am";
        }
        this.event.all_day = all_day;
        this.event.has_time_end = has_time_end;

        this.event.time_start_12 = time_start_12;
        this.event.time_start_ampm = time_start_ampm;
        this.event.time_end_12 = time_end_12;
        this.event.time_end_ampm    = time_end_ampm;
        this.event.time_start = time_start_12 + time_start_ampm;
        this.event.time_end = time_end_12 + time_end_ampm;

        this.event.what = this.$["inp_what"].value.trim();

        this.event.street = this.$["inp_street"].value.trim();
        this.event.city = this.$["inp_city"].value;
        this.event.state = this.$["inp_state"].value.trim();
        this.event.country = this.$["inp_country"].value.trim();

        this.event.tags = this.$["inp_tags"].value.trim();
        this.event.description = this.$["inp_description"].value.replace(/\n/g, '<br />');
        this.event.date = this.currentDate.getUnixTime();

        this.event.repeat_mode = this.$["rad_rec"].value;
        this.event.repeat_period = this.$["r_sel_days"].value;

        var dofs = parseInt(this.$["inp_days_offset"].value, 10) || 0;
        this.event.offset = dofs;
        this.$["inp_days_offset"].value = dofs;

        this.event.repeat_weekdays = this.getRecWeekdays(); 
        this.event.repeat_date_end = this.$["inp_rec_has_end_date"].checked ? this.currentEndDate.getUnixTime() : 0;

        this.event.category_id = this.$["inp_category_id"].value;
        this.event.contact_name = this.$["inp_contact_name"].value.trim();
        this.event.contact_phone = this.$["inp_contact_phone"].value.trim();
        this.event.rsvp_date = this.$["inp_rsvp_date"].value;
        this.event.more_info = this.$["inp_more_info_page"].value;
        this.event.cost = this.$["inp_cost"].value;
        
        if(core.common.isEmpty(this.event.what)) {
            this.event.what = this.whatEmpty;
        }
        this.sendData(
            { act: "save_event", data: varToString(this.event) }, 
            "Saving... Please wait"
        );
    },


    onDeleteClick: function(){
        desktop.modal_dialog.confirm("Delete event?", this.deleteEvent.bind(this));
    },


    deleteEvent: function() {
        this.sendData(
            { act: "delete_event", event_id: this.event.id }, 
              "Deleting... Please wait"
        );
    },



    // send/receive data

    sendData: function(p, status_msg) {
        p.dialog = "calendar";
        core.transport.send("/controller.php", p, this.onServerResponce.bind(this), "POST");
        if(status_msg) {
            this.hideElement("form_table");
            this.showElement("status_msg");
            this.$["status_msg"].innerHTML = status_msg;
        }
        desktop.setState("loading");
    },



    onServerResponce: function(res) {
        if(!res || res.status == "error") {
            this.$["status_msg"].innerHTML = "Server error";        
            return;
        }

        this.setSaveBtnState("add");

        this.hideElement("status_msg");
        this.showElement("form_table");

        desktop.setState("normal");

        switch(res.status) {
            case "event_created":
                var e = clone(this.event);
                e["id"] = res.id;
                core.data.calendar_events.push(e);
                this.eventIdx = null;
                delete(this.event["id"]);
                break;
            case "event_updated":
                var e = clone(this.event);
                core.data.calendar_events[this.eventIdx] = e;
                this.eventIdx = null;
                delete(this.event["id"]);
                break;
            case "event_deleted":
                core.data.calendar_events.splice(this.eventIdx, 1);
                break;
        }

        desktop.hidePopupApp();
    },




    onHideContent: function() {
        try {
            for(var id in desktop.layout.apps) {
                var app = desktop.layout.apps[id];
                if(app) {
                    if(app.appName == "calendar") {
                        app.render();
                    } else if(app.appName == "gmap_events") {
                        app.updateMarkers();
                    }
                }
            }
        } catch(e) {}
    },


    // event inputs

    validateTimeAll: function(time_start_12,time_end_12,time_start_ampm,time_end_ampm){
        if (!this.validateTime(time_start_12) || !this.validateTime(time_end_12)){
                desktop.modal_dialog.alert("Time is not in a valid format");
                return false;
        }
        var timePat = /^(\d{1,2}):(\d{2})?$/;
        var startMatchArray = time_start_12.match(timePat);
        var startHour = parseInt(startMatchArray[1]);
        var startMinute = parseInt(startMatchArray[2]);
        
        var endMatchArray = time_end_12.match(timePat);
        var endHour = parseInt(endMatchArray[1]);
        var endMinute = parseInt(startMatchArray[2]);
        
        if (time_start_ampm == "am" && time_end_ampm == "am"){
            if (startHour > endHour && startHour != 12){
                desktop.modal_dialog.alert("Start time must be less than end time");
                return false;
            } else if (endHour == 12 && startHour < 12){
                desktop.modal_dialog.alert("Start time must be less than end time");
                return false;
            }
            if(startHour = endHour){
                if(startMinute > endMinute){
                    desktop.modal_dialog.alert("Start time must be less than end time");
                    return false;
                }
            }
        }
        if(time_start_ampm == "pm" && time_end_ampm == "am"){
            desktop.modal_dialog.alert("Start time must be less than end time");
            return false;
        }
        return true;
    },



    validateTime: function(timeStr){
        var timePat = /^(\d{1,2}):(\d{2})?$/;
        
        var matchArray = timeStr.match(timePat);
        if (matchArray == null) {
            return false;
        }
        var hour = matchArray[1];
        var minute = matchArray[2];
        
        if (hour < 1  || hour > 12) {
            return false;
        }

        if (minute<0 || minute > 59) {
            return false;
        }
        return true;
    },





    // select time

    showTimeList:function(e) {
        e = core.browser.event.fix(e);
        this.activeTimeSelect = e.target.name;
        var el = this.$["when_time_div"];
        if(!this.isWhenTimeDivRendered) {
            this.isWhenTimeDivRendered = true;
            for(var i=0; i<this.timesList.length; i++) {
                this.buildModel(el, 
                    { tag: "a",
                      events: { onclick: ["onTimeSelectedClick", i ] },
                      html: this.timesList[i] }
                );
            }
        }
        this.showElement("when_time_div");
        var pos = core.browser.element.getPosition(e.target, true);
        el.style.left = pos.left + "px";
        el.style.top = pos.top + e.target.offsetHeight + "px";

        return core.browser.event.kill(e);
    },


    onTimeSelectedClick: function(e, v) {
        this.$["inp_time_" + this.activeTimeSelect].value = this.timesList[v];
    },


    hideTimePopup: function(){
        this.hideElement("when_time_div");
    },




    showDatePicker: function(e){
        e = core.browser.event.fix(e);
        var pos = new Array(e.clientX,e.clientY);
        var w = this;
        core.externals.datepicker({
            inputField: this.$["inp_date"],
            showsTime: false,
            singleClick: true,
            onUpdate: test = function (cal) {w.onDateSelect(cal)},
            position : pos
        });
        this.$["inp_date"].onclick();
    },

    onDateSelect : function(cal){
        this.currentDate = cal.date;
        this.$["div_date"].innerHTML = cal.date.toDateString();
    },



    showRsvpDatePicker: function(e){
        e = core.browser.event.fix(e);
         var pos = new Array(e.clientX,e.clientY);
         var w = this;
         core.externals.datepicker({
             inputField: this.$["inp_rsvp_date"],
             showsTime: false,
             singleClick: true,
             onUpdate: test = function (cal) {w.onRsvpDateSelect(cal)},
             position : pos
         });
         this.$["inp_rsvp_date"].onclick();
           
    },
    onRsvpDateSelect : function(cal){
        this.$["inp_rsvp_date"].value = cal.date.getUnixTime();
        this.$["div_rsvp_date"].innerHTML = cal.date.toDateString();
    },




    //RECURRENCE

    showDatePickerEndDate: function(e){
         e = core.browser.event.fix(e);
         var pos = new Array(e.clientX,e.clientY);
         var w = this;
         core.externals.datepicker({
             inputField: this.$["r_end_day"],
             showsTime: false,
             singleClick: true,
             onUpdate: test = function (cal) {w.onEndDateSelect(cal)},
             position : pos
         });
         this.$["r_end_day"].onclick();
    },


    onEndDateSelect : function(cal){
        this.currentEndDate = cal.date;
        this.$["div_end_date"].innerHTML = cal.date.toDateString();
    },




    setRecData: function(e) {
        this.showRecTab(e.repeat_mode);
        this.$["r_sel_days"].setValue(e.repeat_period || 1);

        var wd = e.repeat_weekdays;
        if(wd.length && e.repeat_mode == "w") {
            var off_days = [ 1, 1, 1, 1, 1, 1, 1 ];
            for(var i=0; i<wd.length; i++) {
                off_days[wd[i]] = 0;
                this.$["cb_weekday_" + wd[i]].setChecked(true);
            }
            for(var i in off_days) {
                if(off_days[i]) {
                    this.$["cb_weekday_" + i].setChecked(false);
                }
            }
        } else if(e.repeat_mode == "m") {
            this.$["inp_days_offset"].value = e.offset;
        }

        if(e.repeat_date_end != 0) {
            this.currentEndDate.setUnixTime(e.repeat_date_end);
            var day   = this.currentEndDate.getDate();
            var month = this.currentEndDate.getMonth();
            var year  = this.currentEndDate.getYear() % 1900 + 1900;
            this.$["div_end_date"].innerHTML = core.common.monthes[month]+" "+day+", "+year;
            this.$["inp_rec_has_end_date"].setChecked(true);
        } else {
            this.$["inp_rec_has_end_date"].setChecked(false);
            this.onRecHasEndChanged();
        }
    },



    showRecTab: function(tabName){
        switch(tabName){
            case "d":
               this.hideElements(["id_week_div","id_month_div","id_year_div"]);
               this.showElements(["id_rec_div","id_day_div"]);
               this.$["r_inp_days_desc"].innerHTML = "day(s)";
            break;
            case "w":
                this.hideElements(["id_month_div","id_year_div"]);
                this.showElements(["id_week_div","id_rec_div","id_day_div"]);
                this.$["r_inp_days_desc"].innerHTML = "week(s)";
            break;
            case "m":
                this.hideElements(["id_day_div","id_week_div","id_year_div"]);
                this.showElements(["id_month_div","id_rec_div"]);
                this.renderMonthRepeatRules();
            break;
            case "y":
                this.hideElements(["id_month_div","id_week_div"]);
                this.showElements(["id_year_div","id_rec_div","id_day_div"]);
                this.$["r_inp_days_desc"].innerHTML = "year(s)";
            break;
            default:
                this.hideElements(["id_day_div","id_week_div","id_month_div","id_year_div","id_rec_div"]);
            break;
        }
    },


    onRecTypeChanged: function(e){
        var v = this.$["rad_rec"].value;
        if(v == "") {
            this.hideElement("box_rec_pattern");
        } else {
            this.showElement("box_rec_pattern");
        }
        this.showRecTab(v);
    },


    getRadioValue: function(mainRadio){
       for (var i = 0 ; i< mainRadio.length;i++){
           if (mainRadio[i].checked){
                return mainRadio[i].value;
           }
       }
    },
    
    getRecWeekdays: function(){
        var res = [];
        for(var i=0; i<7; i++) {
            if(this.$["cb_weekday_" + i].checked) res.push(i);
        }
        return res;
    },


    onRecHasEndChanged: function() {
        if(this.$["inp_rec_has_end_date"].checked) {
            this.showElement("box_rec_end_date");
        } else {
            this.hideElement("box_rec_end_date");
        }
    },



    // month repeat rules

    renderMonthRepeatRules: function(event) {
        if(!this.event.repeat_data.length) {
            this.hideElement("r_month_rules");
            return;
        } else {
            this.showElement("r_month_rules");
        }

        var nums = [ "", "First", "Second", "Third", "Fourth", "Last" ];
        var first_last = [ "First", "Last" ];
        var sat_sun = [ "Saturday", "Sunday" ];

        this.$["r_month_rules"].innerHTML = "";
        for(var i=0; i<this.event.repeat_data.length; i++) {
            var r = this.event.repeat_data[i];
            switch(r.type) {
                case 1:
                    var html = "Every " + r.args[0] + " month(s)";
                    break;
                case 2:
                    var html = "Day " + r.args[1] + " of every " + r.args[0] + " month(s)";
                    break;
                case 3:
                    var html = nums[r.args[1]] + " " + core.common.weekdays[r.args[2]] + " of every " + r.args[0] + " month(s)";
                    break;
                case 5:
                    var html = "The " + sat_sun[r.args[1]] + " of the " + nums[r.args[2]] + " weekend of every " + r.args[0] + " month(s)";
            }
            this.buildModel(this.$["r_month_rules"],
                { tag: "div", 
                  childs: [
                    { tag: "span", innerHTML: html },
                    { tag: "img", className: "icon",
                      title: "Delete rule",
                      src: "/static/icons/cross.png",
                      events: { onclick: [ "onDeleteMonthRule", i ] } }
                  ]}
            );
        }
    },


    addMonthRule1: function(e) {
        var rule = {
            type: 1,
            args: [ parseInt(this.$["r_sel_monthes1"].value, 10) ]
        }
        this.event.repeat_data.push(rule);
        this.renderMonthRepeatRules();
    },

    addMonthRule2: function(e) {
        var d = parseInt(this.$["r_sel_month_day"].value, 10);
        if(!d) d = 1;
        var rule = {
            type: 2,
            args: [ parseInt(this.$["r_sel_monthes2"].value, 10), d ]
        }
        this.event.repeat_data.push(rule);
        this.renderMonthRepeatRules();
    },

    addMonthRule3: function(e) {
        var rule = {
            type: 3,
            args: [ 
                parseInt(this.$["r_sel_monthes3"].value, 10), 
                parseInt(this.$["r_sel_month_dnum3"].value, 10), 
                parseInt(this.$["r_sel_month_wday3"].value, 10) 
            ]
        }
        this.event.repeat_data.push(rule);
        this.renderMonthRepeatRules();
    },

    addMonthRule5: function(e) {
        var rule = {
            type: 5,
            args: [ 
                parseInt(this.$["r_sel_monthes5"].value, 10), 
                parseInt(this.$["r_sel_month_wday5"].value, 10),
                parseInt(this.$["r_sel_weekend_num5"].value, 10)
            ]
        }
        this.event.repeat_data.push(rule);
        this.renderMonthRepeatRules();
    },


    onDeleteMonthRule: function(e, idx) {
        desktop.modal_dialog.confirm("Delete rule?", this.deleteRule.bind(this, idx));
    },

    deleteRule: function(idx) {
        this.event.repeat_data.splice(idx, 1);
        this.renderMonthRepeatRules();
    },


    updateTimeInputs: function() {
        if(this.$["inp_all_day"].checked) {
            this.hideElement("box_time_all");
        } else {
            this.showElement("box_time_all");
            if(this.$["inp_has_time_end"].checked) {
                this.showElement("box_time_end");
            } else {
                this.hideElement("box_time_end");
            }
        }
    },


    // common clicks

    onPopupContentClick: function(e) {
        e = core.browser.event.fix(e);
        this.hideTimePopup();
    }

}
core.apps.calendar_event.extendPrototype(core.components.html_component);
core.apps.calendar_event.extendPrototype(core.components.popup_app);