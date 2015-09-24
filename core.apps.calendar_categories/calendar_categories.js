core.apps.calendar_categories = function() {}


core.apps.calendar_categories.prototype = {


    getTitle: function() {
        return "Edit events categories";
    },


    renderContent: function() {
        this.displayTpl(this.$["content"], "calendar_categories");
        this.clearItemForm();
        this.renderList();
    },





    // list render

    clearList: function() {
        var el = this.$["list_table"];
        while(el.childNodes.length > 3) {
            el.removeChild(el.lastChild);
        }
    },



    renderList: function() {
        this.clearList();
        for(var id in core.data.calendar_categories) {
            var v = core.data.calendar_categories[id];
            this.buildModel(this.$["list_table"],
                { tag: "tr",
                  childs: [
                    { tag: "td", 
                      innerHTML: v.title },
                    { tag: "td", 
                      innerHTML: "<div style='width:auto; background: " + v.color + "'>" + v.color + "</div>" },
                    { tag: "td", 
                      style: { textAlign: "center" },
                      childs: [
                        { tag: "img", className: "icon",
                          title: "Edit category",
                          src: "/static/icons/pencil.png",
                          events: { onclick: [ "onEditItemClick", id ] } },
                        { tag: "span", innerHTML: " &nbsp; " },
                        { tag: "img", className: "icon",
                          title: "Delete category",
                          src: "/static/icons/cross.png",
                          events: { onclick: [ "onDeleteItemClick", id ] } }
                      ]}
                  ]}
            );
        }
    },





// edit list items

    // create

    onAddItemClick: function() {
        var t = this.$["inp_title"].value.trim();
        if(t == "") {
            desktop.modal_dialog.alert("You should specify category title!");
            return
        }
        var p = {
            dialog: "calendar",
            act: "create_category",
            title: t,
            color: this.$["inp_color"].value
        }
        this.setBlocked("Creating category...");
        core.transport.send("/controller.php", p, this.onServerResponce.bind(this));
    },

    // update

    onEditItemClick: function(e, id) {
        this.$["list_box"].scrollTop = 0;
        this.$["btn_save_item"].style.display = "";
        this.hideElement("btn_add_item");
        this.activeItem = id;
        var v = core.data.calendar_categories[id];
        this.$["inp_title"].value = v.title;

        this.$["inp_color"].value = v.color;
        this.$["inp_color"].style.background = v.color;
    },

    onSaveItemClick: function() {
        var v = core.data.calendar_categories[this.activeItem];

        var newTitle = this.$["inp_title"].value.trim();
        var newColor = this.$["inp_color"].value;

        this.$["btn_add_item"].style.display = "";
        this.hideElement("btn_save_item");

        if(v.title != newTitle || v.color != newColor) {
            this.setBlocked("blocked", "Saving category...");
            var p = {
                dialog: "calendar",
                act: "update_category",
                id: this.activeItem,
                title: newTitle,
                color: newColor
            }
            core.transport.send("/controller.php", p, this.onServerResponce.bind(this));
        } else {
            this.clearItemForm();
        }
    },

    // delete

    onDeleteItemClick: function(e, id) {
        desktop.modal_dialog.confirm("Delete category?", this.deleteItem.bind(this, id));
    },


    deleteItem: function(id) {
        this.setBlocked("Deleting category...");
        var p = {
            dialog: "calendar",
            act: "delete_category",
            id: id
        }
        core.transport.send("/controller.php", p, this.onServerResponce.bind(this));
    },


    onServerResponce: function(res) {
        if(res && res.status == "categories") {
            var a = desktop.popup_apps["calendar_event"];
            if(a) a.needCategoriesRefresh = true;
            this.setBlocked(false);
            core.data.calendar_categories = res.data;
            this.updateApps();
            this.renderList();
        } else {
            this.setBlocked("Server responce error!");
        }
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
    },



    // popup controls

    clearItemForm: function() {
        this.$["inp_title"].value = "";
        this.$["inp_color"].value = "#FFF";
        this.$["inp_color"].style.background = "#FFF";
    },


    setBlocked: function(v) {
        if(v) {
            this.clearItemForm();
            this.clearList();
            this.hideElement("item_editor");            
            try{
                this.$["msg"].style.display = "table-row";
            }
            catch(err)
            {   
                this.$["msg"].style.display = "";
            }
            this.$["msg_content"].innerHTML = v;
            this.hideElement("btn_popup_ok");
        } else {
            this.showElement("btn_popup_ok");
            this.hideElement("msg");
            try{
                this.$["item_editor"].style.display = "table-row";
            }
            catch(err)
            {   
                this.$["item_editor"].style.display = "";
            }
            
        }
    },



    showColorPicker: function(e) {
        this.isTmpClean = true;
        desktop.showColorPicker(this.$["inp_color"].value, this.onColorSelected.bind(this));
    },


    onColorSelected: function(c) {
        this.$["inp_color"].value = "#" + c;
        this.$["inp_color"].style.background = "#" + c;
    }

}
core.apps.calendar_categories.extendPrototype(core.components.html_component);
core.apps.calendar_categories.extendPrototype(core.components.popup_app);