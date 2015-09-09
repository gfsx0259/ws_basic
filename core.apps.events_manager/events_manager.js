core.apps.events_manager = function() {

    this.events_offset = 0;
    this.eventsPerPage = 10;
    this.activeBarObj = {};

    this.currentDate = new Date();
    this.currentEndDate = new Date();
    this.eventIdx = null;
    this.event = {};
    this.needShowColorOptionRefresh = true;
};


core.apps.events_manager.prototype = {

    window_resize: {
        min_height: 440,
        min_width: 950,
        target: "events_manager"
    },

    onResize: function(v) {
        this.$["left_menu"].style.height = v.height - 15 + "px";
        this.$["sections_content"].style.height = v.height - 15 + "px";
    },


    getTitle: function() {
        return "Events manager";
    },


    renderContent: function() {
        this.displayTpl(this.$["content"], "events_manager");
        this.clearCategoryForm();
        this.showBar("events");
    },



    // bars code
    onBarClick: function(e) {
        e = core.browser.event.fix(e);
        var el = e.target;
        if(!el.bar_name) el = el.parentNode;
        el.blur();
        this.showBar(el.bar_name);
    },


    bar_names: {
        "events": "Events",
        "categories": "Categories"
    },

    showBar: function(bar) {
        if(this.activeBar) {
            this.hideElement("content_" + this.activeBar);
            this.$["bar_" + this.activeBar].className = "";
        }
        if (this.activeBarObj.cur_tpl) {
            this.hideElement("content_" + this.activeBarObj.cur_tpl);
        }
        
        this.initBarContent(bar);
        this.activeBar = bar;
        this.showElement("content_" + bar);
        this.$["bar_" + bar].className = "active";
        desktop.updatePopupPos();
    },


    isBarContentReady: {},

    
    onCatDropDownContent: function() {
        var opts = [ { text: "Limit to category", value: "" } ];
        var cats = core.data.calendar_categories;
        for(var id in cats) {
            opts.push({ text: cats[id].title, value: id });
        }
        this.$["inp_filter_category"].setOptions(opts);
    },


    cateColorList: [
       ['#CC3333', '#FFF'], ['#DD4477', '#FFF'] , ['#994499', '#FFF'], ['#6633CC', '#FFF'],
       ['#336699', '#FFF'], ['#3366CC', '#FFF'], ['#22AA99', '#FFF'], ['#7B9EF7', '#000'],
       ['#109618', '#FFF'], ['#66AA00', '#FFF'], ['#7FFFFC', '#000'], ['#D6AE00', '#000'],
       ['#68D1CA', '#000'], ['#577CAF', '#FFF'], ['#9662C4', '#FFF'], ['#CC668E', '#000'], 
       ['#EFAD77', '#000'], ['#C7FF7F', '#000'], ['#DBA1A9', '#000'],
       ['#EE8800', '#FFF'], ['#DD5511', '#FFF'], ['#A87070', '#FFF'], ['#8C6D8C', '#FFF'],
       ['#627487', '#FFF'], ['#5C8D87', '#FFF'], ['#898951', '#FFF'], ['#B08B59', '#000'],
       ['#F1EF82', '#000'], ['#E7C391', '#000'], ['#87867A', '#000'], ['#ADE5F8', '#000'],
       ['#FFFFFF', '#000'], ['#C6B363', '#000'], ['#9DBC5E', '#FFF'], ['#FF7FF6', '#000'],
       ['#773B3B', '#000'], ['#0099FF', '#000'], ['#FFFF33', '#000']
    ],


    initBarContent: function(bar) {
        if(this.isBarContentReady[bar]) return;
        switch(bar) {
            case "events":
                this.onCatDropDownContent();
                this.loadEvents(true);
                break;

            case "categories":
                if(!core.data.calendar_categories) {
                    this.setBarBlocked("Loading...", 'categories');
                    var p = {
                        dialog: "calendar",
                        act: "get_categories"
                    };
                    core.transport.send("/controller.php", p, this.onCategoriesData.bind(this), "POST");
                } else {
                    this.renderCategoriesList();
                }
                break;
        }
        this.isBarContentReady[bar] = true;
    },


    onOkClick: function() {
        this.showElement("content_events");
        this.hideElement("content_events_editform");
        this.onCloseClick();
        
    },  

     
    onBtnClick_Events_AddEvent: function(e) {
        var curDate = new Date().getUnixTime();
        var args = [curDate];
        this.manageEvent(e, args);
    },


    onCancelEventClick: function() {
        this.activeBar = "events";
        this.showElement("content_events");
        this.hideElement("content_events_editform");
    },





    // Categories
    onCategoriesData: function(r) {
        if(r && r.status == "categories") {
            core.data.calendar_categories = r.data;
            this.renderCategoriesList();
        }
    },

    // Events
    onEventsSearchClick: function() {
        var p = this.getSearchFilter();
        this.setBarBlocked("Searching...", 'events');
        core.transport.send("/controller.php", p, this.onEventsResponce.bind(this), "POST");
        //this.onResetEventsSearchClick();
    },


    onResetEventsSearchClick: function() {
        this.$["inp_filter_event_name"].setValue(false);
        this.$["inp_filter_category"].selectedIndex = 0;
        this.onEventsSearchClick();
    },


    getSearchFilter: function() {
        var f = {
            q: '',//this.$["inp_filter_q"].value.trim(),
            event: this.$["inp_filter_event_name"].getValue(),
            category: this.$["inp_filter_category"].value,
            dialog: "calendar",
            act: "get_events",
            get_categories: 1
        };
        return f;
    },


    loadEvents: function(load_categories) {
        this.setBarBlocked("Loading...", 'events');
        var p = this.getSearchFilter();
        p.dialog = "calendar";
        p.act = "get_data";
        if(load_categories) {
            p.get_categories = 1;
        }
        p.offset = this.events_offset;
        core.transport.send("/controller.php", p, this.onEventsResponce.bind(this), "POST");
    },


    onEventsResponce: function(r) {
        if(r && r.status == "data") {
            core.data.calendar_events = r.events;
            if(r.categories) {
                core.data.calendar_categories = r.categories;
                this.onCatDropDownContent();
            }
            this.renderEventsList();
        }
    },


    setEventsOffset: function(v) {
        this.events_offset = v;
        this.loadEvents();
    },



    // render events list

    clearBarList: function(bar) {
        var el = this.$[bar+"_table"];
        while(el.childNodes.length > 1) {
            el.removeChild(el.lastChild);
        }
    },


    renderEventsList: function() {
        this.setBarBlocked(false, 'events');
        this.clearBarList('events');
        for(var i=0; i<core.data.calendar_events.length; i++) {
            var v = core.data.calendar_events[i];
            var category = core.data.calendar_categories[v.category_id] || {};

            this.currentDate.setUnixTime(v.date);
            var m =                 
                { tag: "tr",
                  childs: [
                    { tag: "td", innerHTML: this.currentDate.format("d/m/Y") },
                    { tag: "td", innerHTML: v.what },
                    { tag: "td", 
                      className: "ta_center",
                      innerHTML: 
                        '<div style="color:' + (category.textcolor || "") +
                        ';background-color:' + (category.color || "")+
                        '; width: 300px;line-height: 25px;">'+
                        '<p style="vertical-align: middle;margin-left: 5px;">' + (category.title || "") + '</p></div>' 
                      },

                    { tag: "td", 
                      className: "ta_center last",
                      childs: [
                        { tag: "img", className: "icon",
                          title: "Edit",
                          src: "/static/icons/pencil.png",
                          events: { onclick: [ "manageEvent",[v.date, i] ] } },
                        { tag: "span", innerHTML: " &nbsp; " },
                        { tag: "img", className: "icon",
                          title: "Delete",
                          src: "/static/icons/cross.png",
                          events: { onclick: [ "onDeleteEventClick", i ] } }
                      ]}
                  ]};
            this.buildModel(this.$["events_table"], m);
        }
    },
    

    manageEvent: function(e, args) {
        this.isBarContentReady['events'] = false;
        if(core.usertype >= USERTYPE_ADMIN || core.data.c_permissions["manage_events"] == 1) {
            desktop.openCalendarEvent({ date: args[0], eventIdx: args[1] });
        } else if(args[1] != undefined) {
            this.showPopup(e, args[1]);
        }
    },


    onShowContent: function() {
        if(core.values.events_manager_section) {
            this.showBar(core.values.events_manager_section);
            core.values.events_manager_section = null;
            return;
        }
        var bar = '';
        if (this.activeBar == 'events') {
            this.activeBar = 'categories';
            bar = 'events';
        } else {
            this.activeBar = 'events';
            bar = 'categories';
        }
        this.showBar(bar);
    },


    setBgTextColor: function(e, bgColor) {
        var color = String(bgColor[1]);
        this.$["inp_bg_color"].value = color.replace('#','');
        this.$["inp_bg_color"].style.background = color;
        color = String(bgColor[0]);
        this.$["inp_color"].style.background = color;
        this.$["inp_color"].value = color.replace('#','');
    },

     
    showColorOptions: function() {
        if(!this.needShowColorOptionRefresh) return;

        var chld1 = [];
        var chld2 = [];
        var j = 0;
        for(var i=0; i<this.cateColorList.length; i++) {
            if(i < 19) {
                chld1[j] = [
                  { tag: "td", style: {backgroundColor: this.cateColorList[i][0], fontWeight: "bold", fontSize: "28px", fontFamily: "arial", color: this.cateColorList[i][1], height: "26px", valign: "center", textAlign: "center", cursor: 'pointer' },innerHTML:  'A', events: { onclick: [ "setBgTextColor",  this.cateColorList[i] ] } }
                ];
                j++;
            } else {
                if(i==19) {
                    j = 0;
                }
                chld2[j] = [
                  { tag: "td", style: {backgroundColor: this.cateColorList[i][0], fontWeight: "bold", fontSize: "28px", fontFamily: "arial", color: this.cateColorList[i][1], height: "26px", valign: "center", textAlign: "center", cursor: 'pointer' },innerHTML:  'A', events: { onclick: [ "setBgTextColor",  this.cateColorList[i] ] } }
                ];
                j++;
            }
        }

        var m = {
            tag: "tr",
            childs: chld1
        };
        this.buildModel(this.$["default_colors"], m);        

        var m = {
            tag: "tr",
            childs: chld2
        };
        this.buildModel(this.$["default_colors"], m);
        this.needShowColorOptionRefresh = false; 
    },


    renderCategoriesList: function() {
        this.setBarBlocked(false, 'categories');
        this.clearBarList('categories');
        var forColor = 'black';
        this.showColorOptions();
        for(var id in core.data.calendar_categories) {
            var v = core.data.calendar_categories[id];
            var m =                 
                { tag: "tr",
                  childs: [
                    { tag: "td", 
                      innerHTML: 
                        '<div style="color:'+ (v.textcolor || "") +
                        ';background-color:'+ (v.color || "") + '; width: 100%;line-height: 25px;">'+
                        '<p style="vertical-align: middle;margin-left: 5px;">' + v.title + '</p></div>' },
                    { tag: "td", 
                      className: "ta_center last",
                      childs: [
                        { tag: "img", className: "icon",
                          title: "Edit",
                          src: "/static/icons/pencil.png",
                          events: { onclick: [ "onEditCategoryClick", id ] } },
                        { tag: "span", innerHTML: " &nbsp; " },
                        { tag: "img", className: "icon",
                          title: "Delete",
                          src: "/static/icons/cross.png",
                          events: { onclick: [ "onDeleteCategoryClick", id ] } }
                      ]}
                  ]};
            this.buildModel(this.$["categories_table"], m);
        }
    },



    // edit events

    onEditEventClick: function(e, idx) {
        this.eventIdx = idx;
        var data = core.data.calendar_events[idx];
        data.eventIdx = idx;
        this.activeBarObj.mode = "create";
        this.activeBarObj.cur_tpl = "events_editform";
        //this.renderBarTitle();
        this.hideElement("content_events");
        this.showElement("content_events_editform");
        this.initBarContent_Events_EditForm(data);
    },


    clearEventForm: function() {
        this.$["inp_event_name"].value = "";
        this.$["inp_event_email"].value = "";
        this.$["inp_event_pwd"].value = "";
        this.$["inp_event_subscribed"].checked = false;
        this.$["inp_event_confirmed"].checked = core.data.site_info.events_reg_confirmation == 0;
        this.$["inp_event_contributor"].checked = false;
        this.showElement("btn_add_event");
        this.hideElement("btn_save_event");
    },



    // add event

    onAddEventClick: function(e) {
        var d = this.processEventForm();
        if(d) {
            this.setBarBlocked("Saving...",'events');
            d.dialog = "events";
            d.act = "create_event";
            core.transport.send("/controller.php", d, this.onAddEventResponce.bind(this), "POST");
        }
    },


    onAddEventResponce: function(r) {
        if(!r) {
            this.setBarBlocked("Server error",'events');
        } else {
            this.eventIdx = '';
            this.event = '';
            this.loadEvents();
            if(r.status != "ok") {
                this.setBarBlocked(false,'events');
                desktop.modal_dialog.alert("Email already used");
            } else {
                this.clearEventForm();
            }
        }
    },



    // delete event

    onDeleteEventClick: function(e, idx) {
        desktop.modal_dialog.confirm("Delete event?", this.deleteEvent.bind(this, idx));
    },


    deleteEvent: function(idx) {
        this.setBarBlocked("Deleting event...", 'events');
        var p = {
            dialog: "calendar",
            act: "delete_event",
            event_id: core.data.calendar_events[idx].id
        };
        core.transport.send("/controller.php", p, this.onDeleteEventResponce.bind(this), "POST");
    },


    onDeleteEventResponce: function(r) {
        if(r && r.status == "event_deleted") {
            this.updateApps();
            this.loadEvents();
        } else {
            this.setBarBlocked("Server error", 'events');
        }
    },




    // common funcs

    setBarBlocked: function(v, bar) {
        if(v) {
            this.clearBarList(bar);
            this.showElement("msg_"+bar);
            this.$["msg_"+bar+"_content"].innerHTML = v;
            this.hideElement("btn_popup_ok");
        } else {
            this.showElement("btn_popup_ok");
            this.hideElement("msg_"+bar);
        }
    },



//============================================================================
//======================= Add Events categories ==============================
//============================================================================

    showBgColorPicker: function(e) {
        this.isTmpClean = true;
        desktop.showColorPicker(this.$["inp_bg_color"].value, this.onBgColorSelected.bind(this));
    },


    onBgColorSelected: function(c) {
        this.$["inp_bg_color"].value = c;
        this.$["inp_bg_color"].style.background = "#" + c;
    },

    showColorPicker: function(e) {
        this.isTmpClean = true;
        desktop.showColorPicker(this.$["inp_color"].value, this.onColorSelected.bind(this));
    },


    onColorSelected: function(c) {
        this.$["inp_color"].value = c;
        this.$["inp_color"].style.background = "#" + c;
    },

    onAddCategoryClick: function() {
        var t = this.$["inp_title"].value.trim();
        if(t == "") {
            desktop.modal_dialog.alert("You should specify category title!");
            return
        }
        var p = {
            dialog: "calendar",
            act: "create_category",
            title: t,
            color: '#'+this.$["inp_color"].value,
            textcolor: '#'+this.$["inp_bg_color"].value
        };
        this.setBarBlocked("Creating category...", 'categories');
        core.transport.send("/controller.php", p, this.onServerResponce.bind(this));
    },

    onServerResponce: function(res) {
        if(res && res.status == "categories") {
            this.setBarBlocked(false, 'categories');
            this.clearCategoryForm();
            core.data.calendar_categories = res.data;
            this.renderCategoriesList();
            this.updateApps();
            this.isBarContentReady['events'] = false;
        } else {
            this.setBarBlocked("Server responce error!", 'categories');
        }
    },
    
    clearCategoryForm: function() {
        this.$["inp_bg_color"].value = 'FFFFFF';
        this.$["inp_bg_color"].style.background = '#FFF';
        this.$["inp_color"].value = '000000';
        this.$["inp_color"].style.background = '#000';
        this.$["inp_title"].value = '';
    },

    onUpdateCategoryClick: function() {
        var v = core.data.calendar_categories[this.activeCat];

        var newTitle = this.$["inp_title"].value.trim();
        var newColor = this.$["inp_color"].value;
        var newBgColor = this.$["inp_bg_color"].value;

        this.$["btn_save_categories"].style.display = "";
        this.hideElement("btn_update_categories");

        if(v.title != newTitle || v.color != newColor || v.textcolor != newBgColor) {
            this.setBarBlocked("Updating category...", 'categories');        
            var p = {
                dialog: "calendar",
                act: "update_category",
                id: this.activeCat,
                title: newTitle,
                color: '#'+newColor,
                textcolor: '#'+newBgColor
            };
            core.transport.send("/controller.php", p, this.onServerResponce.bind(this));
        } else {
            this.clearItemForm();
        }
    },
    

    onEditCategoryClick: function(e, id) {
        this.activeCat = id;
        var v = core.data.calendar_categories[this.activeCat];
        this.$["inp_title"].value = v.title;
        var color = 'white';
        color = String(v.textcolor);
        this.$["inp_bg_color"].value = color.replace('#','');
        this.$["inp_bg_color"].style.background = color;
        color = String(v.color);
        this.$["inp_color"].style.background = color;
        this.$["inp_color"].value = color.replace('#','');
        this.$["btn_update_categories"].style.display = "";
        this.hideElement("btn_save_categories");
    },


    onDeleteCategoryClick: function(e, id) {
        desktop.modal_dialog.confirm("Delete category?", this.deleteCategory.bind(this, id));
    },

    deleteCategory: function(id) {
        this.setBarBlocked("Deleting category...", 'events');
        var p = {
            dialog: "calendar",
            act: "delete_category",
            id: id
        };
        core.transport.send("/controller.php", p, this.onServerResponce.bind(this));
    },
    

   
    
    updateApps: function() {
        if(!desktop.layout.apps) return;
        for(var id in desktop.layout.apps) {
            var app = desktop.layout.apps[id];
            if(app) {
                if(app.appName == "calendar") {
                    app.render();
                } else if(app.appName == "events_categories") {
                    app.refresh();
                } else if(app.appName == "gmap_events") {
                    app.updateMarkers();
                }
            }
        }
    }
    
};
core.apps.events_manager.extendPrototype(core.components.html_component);
core.apps.events_manager.extendPrototype(core.components.popup_app);