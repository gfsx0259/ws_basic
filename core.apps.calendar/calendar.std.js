core.apps.calendar.extendPrototype({


    addEventView: function (tmpDate, name, maxWidth) {
        var ids = this.getTodayEvents(tmpDate);
        if (ids) {
            for (var k = 0; k < ids.length; k++) {
                var event = this.events_list[ids[k]];
                if (event.all_day == 1) {
                    var ampm = "all_day";
                    var html = event.what;
                } else {
                    var ampm = event.time_start_ampm;
                    var html = event.time_start_12 + "&nbsp;" + event.what;
                }

                var m =
                {
                    tag: "a",
                    className: "event_header",
                    html: html,
//                      style: {width: maxWidth+"px"},
                    events: {onclick: ["manageEvent", [event.date, ids[k]]]}
                };

                var cat = core.data.calendar_categories[event.category_id];
                if (cat) {
                    m.style = {background: cat.color || "", color: cat.textcolor || ""};
                }
                this.buildModel(this.$["td" + name], m);
            }
        } else {
            this.$["td" + name].onclick = this.manageEvent.bindAsEventListener(this, [tmpDate.getUnixTime()]);
        }
    },


    // args: [ date, event_idx ]
    manageEvent: function (e, args) {
        e = core.browser.event.fix(e);
        if (core.usertype >= USERTYPE_ADMIN || core.data.c_permissions["manage_events"] == 1) {
            desktop.openCalendarEvent({date: args[0], eventIdx: args[1]});
        } else if (args[1] != undefined) {
            this.showPopup(e, args[1]);
        }
        core.browser.event.kill(e);
    }


});