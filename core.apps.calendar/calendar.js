core.apps.calendar = function (args) {


    this.defaultProfile = {
        title: "",
        app_style: "",
        filter: "",
        layout: "calendar",
        monthes_count: 1
    };

    this.currentDate = new Date();
    this.currentDate.setDate(1);

};


core.apps.calendar.prototype = {

    onOpen: function () {
        this.setTitle(this.profile["title"]);
    },


    onAppStyleChanged: function () {
        if (!this.$["popup_wrapper"]) return;
        this.$["popup_wrapper"].className = this.getAppStyleSelector();
    },


    buildContent: function (el) {
        this.viewMode = this.profile["layout"];
        this.displayTpl(this.$["content"], "calendar_list");
//        this.$["calendar_list"].style.height = this.profile["height"]+"px";
        this.loadData();
    },


    // load events & categories

    loadData: function () {
        var r = {};
        r.dialog = "calendar";
        r.act = "get_data";
        if (!core.data.calendar_categories) {
            r.get_categories = "1"
        }
        core.transport.send("/controller.php", r, this.onDataLoaded.bind(this));
    },

    onDataLoaded: function (res) {
        if (res && res.status == "data") {
            if (res.categories) {
                core.data.calendar_categories = res.categories;
            }
            core.data.calendar_events = res.events;
        } else {
            core.data.calendar_events = [];
        }

        this.filterEventsByTags();
        this.render();
    },


    filterEventsByTags: function () {
        if (core.common.isEmpty(this.profile["filter"])) {
            this.events_list = core.data.calendar_events;
        } else {
            this.events_list = [];

            var i, j, res = [], tags, filter = [], filter_tmp = this.profile["filter"].split(",");

            // prepare filter
            for (j = 0; j < filter_tmp.length; j++) {
                tag = filter_tmp[j].trim().toLowerCase();
                if (tag != "") {
                    filter.push(tag);
                }
            }


            // filter events
            for (i = 0; i < core.data.calendar_events.length; i++) {
                tags = core.data.calendar_events[i].tags.toLowerCase();
                for (j = 0; j < filter.length; j++) {
                    if (tags.search(filter[j]) != -1) {
                        this.events_list.push(core.data.calendar_events[i]);
                        break;
                    }
                }
            }
        }
    },


    // navigation
    onPrevClick: function (e) {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    },


    onNextClick: function (e) {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    },


    onNowClick: function (e) {
        e = core.browser.event.fix(e);
        e.target.blur();
        this.currentDate = new Date();
        this.currentDate.setDate(1);
        this.render();
    },


    // display

    render: function () {
        var el = this.$["event_popup"];
        if (el && el.parentNode != document.body) {
            document.body.appendChild(el);
        }

        this.$["dateTitle"].innerHTML = this.currentDate.format("M Y");
        this.display_date = new Date();
        this.display_date.setTime(this.currentDate.getTime());

        this.$["calendar_list"].innerHTML = "";
        for (var i = 0; i < this.profile.monthes_count; i++) {
            this.display_date.setMonth(this.currentDate.getMonth() + i);

            if (this.profile.monthes_count > 1) {
                this.buildModel(this.$["calendar_list"],
                    {
                        tag: "div", className: "month_title",
                        innerHTML: this.display_date.format("M Y")
                    }
                );
            }

            switch (this.profile.layout) {
                case "calendar":
                    this.renderCalendar();
                    break;

                case "list":
                    this.renderList();
                    break;
            }
        }
    },


    // render

    renderCalendar: function () {
        this.displayTpl(this.$["calendar_list"], "calendar_content");
//        this.$["calContentDiv"].style.minHeight = (parseInt(this.profile["height"])+20)+"px";

        var month = this.display_date.getMonth();
        var year = this.display_date.getYear() % 1900 + 1900;
        var maxWidth = (this.$["calContentDiv"].clientWidth - 0.1 * this.$["calContentDiv"].clientWidth) / 7;
        maxWidth = maxWidth > 97 ? 97 : maxWidth;
        month = parseInt(month);
        year = parseInt(year);
        var i = 0;
        var daysLast = this.getDaysInMonth(month, year);
        var days = this.getDaysInMonth(month + 1, year);
        var firstOfMonth = new Date(year, month, 1);
        var startingPos = firstOfMonth.getDay();
        days += startingPos;

        var weekCnt = 0;

        core.browser.element.clear(this.$["calTbl"]);

        this.buildModel(this.$["calTbl"],
            {
                tag: "tr", className: "header",
                childs: [
                    {tag: "th", html: "Sun"},
                    {tag: "th", html: "Mon"},
                    {tag: "th", html: "Tue"},
                    {tag: "th", html: "Wed"},
                    {tag: "th", html: "Thu"},
                    {tag: "th", html: "Fri"},
                    {tag: "th", html: "Sat"}
                ]
            }
        );


        var weekCnt2 = 0;
        var maxD = days > 35 ? 42 : 35;
        for (var i = 0; i < maxD; i++) {
            if (i % 7 == 0) weekCnt2++
        }
        var maxHeight = parseInt(this.profile["height"]) / weekCnt2;

        // prev month
        for (var i = 0; i < startingPos; i++) {
            if (i % 7 == 0) {
                weekCnt++;
                this.buildModel(this.$["calTbl"], {tag: "tr", id: "tr" + weekCnt});
            }

            var displayDay = daysLast - startingPos + i + 1;
            var tmpDate = new Date(year, month - 1, displayDay);
            var name = " " + weekCnt + (month - 1) + displayDay;
            this.buildModel(this.$["tr" + weekCnt],
                {
                    tag: "td",
                    id: "td" + name,
                    className: "lastDay"
                }
            );

            this.buildModel(this.$["td" + name],
                {
                    tag: "div",
                    html: displayDay,
                    className: "day_header",
                    events: {onclick: ["manageEvent", [tmpDate.getUnixTime()]]}
                }
            );
            this.addEventView(tmpDate, name, maxWidth);
        }


        // active month
        var now = new Date();
        var todayDay = now.getDate();
        var todayMonth = now.getMonth();
        var todayYear = now.getYear() % 1900 + 1900;
        for (var i = startingPos; i < days; i++) {
            if (i % 7 == 0) {
                weekCnt++;
                this.buildModel(this.$["calTbl"], {tag: "tr", id: "tr" + weekCnt});
            }
            var displayDayCur = i - startingPos + 1;
            if (todayDay == displayDayCur && month == todayMonth && year == todayYear) {
                dayClass = "today";
            } else {
                dayClass = "";
            }

            var tmpDate = new Date(year, month, displayDayCur);
            var name = " " + weekCnt + month + displayDayCur;
            this.buildModel(this.$["tr" + weekCnt],
                {
                    tag: "td",
                    id: "td" + name,
                    className: dayClass
                }
            );
            this.buildModel(this.$["td" + name],
                {
                    tag: "div",
                    html: displayDayCur,
                    className: "day_header",
                    events: {
                        onclick: ["manageEvent", [tmpDate.getUnixTime()]]
                    }
                }
            );
            this.addEventView(tmpDate, name, maxWidth);
        }


        // next month
        var maxD = days > 35 ? 42 : 35;
        var nextDays = 1;
        for (i = days; i < maxD; i++) {
            if (i % 7 == 0) {
                weekCnt++;
                this.buildModel(this.$["calTbl"], {tag: "tr", id: "tr" + weekCnt});
            }
            var tmpDate = new Date(year, month + 1, nextDays);
            var name = " " + weekCnt + (month + 1) + nextDays;
            this.buildModel(this.$["tr" + weekCnt],
                {
                    tag: "td",
                    id: "td" + name,
                    className: "lastDay"
                }
            );
            this.buildModel(this.$["td" + name],
                {
                    tag: "div",
                    html: nextDays++,
                    className: "day_header",
                    events: {
                        onclick: ["manageEvent", [tmpDate.getUnixTime()]]
                    }
                }
            );
            this.addEventView(tmpDate, name, maxWidth);
        }
    },


    renderList: function () {
        var month = this.display_date.getMonth();
        var year = this.display_date.getYear() % 1900 + 1900;
        var daysLast = this.getDaysInMonth(month + 1, year);

        var mdays = [];
        for (var day = 1; day <= daysLast; day++) {
            var md = [];
            var dayDate = new Date(year, month, day);
            var idx = this.getTodayEvents(dayDate);
            if (idx) {
                for (var i = 0; i < idx.length; i++) {
                    var event = this.events_list[idx[i]];
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
                        events: {onclick: ["manageEvent", [event.date, idx[i]]]}
                    };
                    var cat = core.data.calendar_categories[event.category_id];
                    if (cat) {
                        m.style = {background: cat.color || "", color: cat.textcolor || ""};
                    }

                    md.push(m);
                    md.push({tag: "div", id: "event_info" + event.date + "-" + idx[i]});
                }
                mdays.push(
                    {
                        tag: "div", className: "event_day",
                        childs: [
                            {
                                tag: "div", className: "title",
                                innerHTML: core.common.monthes[month] + " " + day
                            },
                            {
                                tag: "div", className: "events",
                                childs: md
                            }
                        ]
                    }
                );
            }
        }
        if (mdays.length == 0) {
            /* mdays = { tag: "text", innerHTML: "No events for this month" } */
            mdays = {tag: "div", className: "event_day", innerHTML: "No events for this month"}
        }
        this.buildModel(this.$["calendar_list"], mdays);
    },


    // events funcs

    getTodayEvents: function (showDate) {
        if (this.events_list[0] == undefined) {
            return false;
        }

        var res = [];

        //optimize it to get all periods for current day in start of printTimeTable function
        var showDay = parseInt(showDate.getDate());
        var showMonth = parseInt(showDate.getMonth());
        var showYear = parseInt(showDate.getYear() % 1900 + 1900);

        var eventDate = new Date();
        for (var i = 0; i < this.events_list.length; i++) {
            eventDate.setUnixTime(this.events_list[i].date);
            var day = parseInt(eventDate.getDate());
            var month = parseInt(eventDate.getMonth());
            var year = parseInt(eventDate.getYear() % 1900 + 1900);

            if ((day == showDay && month == showMonth && year == showYear) || this.isRecurrence(this.events_list[i], showDate)) {
                res.push(i);
            }
        }
        return res.length ? res : false;
    },


    isRecurrence: function (e, showDate) {
        var showDay = parseInt(showDate.getDate());
        var showMonth = parseInt(showDate.getMonth());
        var showYear = parseInt(showDate.getYear() % 1900 + 1900);
        var showDayOfWeek = parseInt(showDate.getDay());
        showDate = new Date(showYear, showMonth, showDay);

        var eventDate = new Date();

        if (e.repeat_mode == "" || (e.repeat_date_end != 0 && e.repeat_date_end < showDate.getUnixTime())) return false;

        if (e.repeat_mode == "m") {
            var ofs = parseInt(e.offset);
            if (ofs > 0) {
                showDate.setDate(showDay - ofs);
            }

            showDate.setHours(0, 0, 0, 0);

            for (var i = 0; i < e.repeat_data.length; i++) {
                var rule = e.repeat_data[i];

                eventDate.setUnixTime(e.date);
                eventDate.setHours(0, 0, 0, 0);

                switch (rule.type) {
                    case 1:
                    case 2:
                        if (rule.type == 2) eventDate.setDate(rule.args[1]);
                        while (eventDate <= showDate) {
                            if (eventDate.getUnixTime() == showDate.getUnixTime()) return true;
                            eventDate.setMonth(eventDate.getMonth() + parseInt(rule.args[0]));
                        }
                        break;
                    case 3:
                        this.setDateRule3(eventDate, rule.args[2], rule.args[1]);
                        while (eventDate <= showDate) {
                            if (eventDate.getUnixTime() == showDate.getUnixTime()) return true;
                            eventDate.setDate(1);
                            eventDate.setMonth(eventDate.getMonth() + rule.args[0]);
                            this.setDateRule3(eventDate, rule.args[2], rule.args[1]);
                        }
                        break;
                    case 5:
                        this.setDateRule5(eventDate, rule.args[2], rule.args[1]);
                        while (eventDate <= showDate) {
                            if (eventDate.getUnixTime() == showDate.getUnixTime()) return true;
                            eventDate.setDate(1);
                            eventDate.setMonth(eventDate.getMonth() + parseInt(rule.args[0]));
                            this.setDateRule5(eventDate, rule.args[2], rule.args[1]);
                        }
                        break;
                }
            }
            return false;
        }

        eventDate.setUnixTime(e.date);

        //important: infinite loop if e.repeat_period = 0
        var period = parseInt(e.repeat_period);
        if (!period) return true;

        while (eventDate <= showDate) {
            var day = parseInt(eventDate.getDate());
            var month = parseInt(eventDate.getMonth());
            var year = parseInt(eventDate.getYear() % 1900 + 1900);
            switch (e.repeat_mode) {
                case "d":
                    eventDate = new Date(year, month, day + period);
                    if (eventDate.getUnixTime() == showDate.getUnixTime()) return true;
                    break;
                case "w":
                    eventDate = new Date(year, month, day + 7 * period);
                    if (e.repeat_weekdays.length) {
                        var eventYear = parseInt(eventDate.getYear() % 1900 + 1900);
                        if (showYear == eventYear && this.getWeekNumber(eventDate) == this.getWeekNumber(showDate)) {
                            for (var i = 0; i < e.repeat_weekdays.length; i++) {
                                if (e.repeat_weekdays[i] == showDayOfWeek) return true;
                            }
                        }
                    } else {
                        if (eventDate.getUnixTime() == showDate.getUnixTime()) return true;
                    }
                    break;
                case "y":
                    eventDate = new Date(year + period, month, day);
                    if (eventDate.getUnixTime() == showDate.getUnixTime()) return true;
                    break;
            }
        }
        return false;
    },


    setDateRule3: function (date, week_day, pos) {
        if (pos == 5) {
            // last
            var last_day = this.getDaysInMonth(date.getMonth() + 1, date.getFullYear());
            date.setDate(last_day);

            var day = last_day - date.getDay() + parseInt(week_day, 10);
            if (day > last_day) {
                day -= 7;
            }

            date.setDate(day);
            /*
             if(date.getDay() > week_day) {
             date.setDate(last_day - (date.getDay() - week_day));
             } else if(date.getDay() < week_day){
             date.setDate(last_day - (date.getDay() - week_day) - 7);
             }
             */
        } else {
            // 1..4
            date.setDate(1);
            var day = 1 - date.getDay() + parseInt(week_day, 10);
            if (day < 1) day += 7;
            date.setDate(day + 7 * (parseInt(pos) - 1));
        }
    },


    // weekend_ofs: 0 - saturday, 1 - sunday
    setDateRule5: function (date, weekend_num, weekend_ofs) {
        if (weekend_num < 5) {
            // 1..4 weekends
            date.setDate(1);
            var day = 7 - date.getDay();
            date.setDate(day + (weekend_num - 1) * 7 + weekend_ofs);
        } else {
            // last weekend
            var last_day = this.getDaysInMonth(date.getMonth() + 1, date.getFullYear());
            date.setDate(last_day);
            var day = last_day - date.getDay() - 1;
            date.setDate(day + weekend_ofs);

        }
    },


    // popup

    // event popup (view mode)

    fillPopupField: function (field, value) {
        var fl = !core.common.isEmpty(value);
        this.$["popup_sec_" + field].style.display = fl ? "" : "none";
        this.$["popup_inp_" + field].innerHTML = fl ? value.trim() : "";
    },

    popupFields: ["tags", "description", "contact_name", "contact_phone", "cost"],

    showPopup: function (e, event_idx) {
        if (!this.isEventPopupRendered) {
            this.isEventPopupRendered = true;
            this.displayTpl(document.body, "calendar_event_popup");
            this.$["popup_wrapper"].className = this.getAppStyleSelector();
        }
        e = core.browser.event.fix(e);
        var event = this.events_list[event_idx];
        eventDate = new Date();
        eventDate.setUnixTime(event.date);

        if (event.all_day != 1) {
            var time = ", " + event.time_start_12 + event.time_start_ampm;
            if (event.has_time_end == 1) {
                time += " - " + event.time_end_12 + event.time_end_ampm;
            }
        } else {
            var time = ""
        }
        this.$["popup_inp_what"].innerHTML = event.what.trim();
        this.$["popup_inp_when"].innerHTML = eventDate.format() + time;
        this.$["popup_more_info"].style.display = '';
        this.$["popup_more_info_link"].innerHTML = "<a href='/" + event.more_info + ".html'>More Info...</a>";

        var where = "";
        if (event.street != "") where += event.street;
        if (event.city != "") where += ", " + event.city;
        if (event.state != "") where += ", " + event.state;
        if (event.country != "") where += ", " + event.country;

        this.fillPopupField("where", where);

        for (var i = 0; i < this.popupFields.length; i++) {
            var f = this.popupFields[i];
            this.fillPopupField(f, event[f]);
        }
        this.showPopupBox(e);
    },


    showPopupBox: function (e) {
        e = core.browser.event.fix(e);
        var scroll = core.browser.getScroll();
        var ds = core.browser.getDocumentSize();
        this.showElement("event_popup");
        var pel = this.$["event_popup"];
        pel.style.top = scroll.top + e.clientY + "px";

        var left = e.clientX;
        if (left + pel.offsetWidth > ds.width) {
            left = ds.width - pel.offsetWidth;
        }
        pel.style.left = left + "px";
    },


    hidePopup: function () {
        this.hideElement("event_popup");
    },


    // funcs

    getDaysInMonth: function (month, year) {
        var daysInMonth = [31, 31, ((this.isLeapYear(year)) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return daysInMonth[month];
    },

    isLeapYear: function (Year) {
        return (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0))
    },

    getWeekNumber: function (tDate) {
        var onejan = new Date(tDate.getFullYear(), 0, 1);
        return Math.ceil((((tDate - onejan) / 86400000) + onejan.getDay()) / 7);
    }

};
core.apps.calendar.extendPrototype(core.components.html_component);
core.apps.calendar.extendPrototype(core.components.desktop_app);