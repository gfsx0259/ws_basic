core.apps.events_categories = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: ""
    }

};


core.apps.events_categories.prototype = {

    
    onOpen: function() {
        this.setTitle(this.profile["title"]);
        if(!core.data.calendar_categories) {
            this.loadCategories();
        } else {
            this.refresh();
        }
    },


    // load categories

    loadCategories: function() {
        this.$["content"].innerHTML = "Loading...";
        var r = {
            dialog: "calendar",
            act: "get_categories"
        };
        core.transport.send("/controller.php", r, this.onCategoriesResponce.bind(this));
    },


    onCategoriesResponce: function(res) {
        if(res && res.status == "categories") {
            core.data.calendar_categories = res.data;
            this.refresh();
        } else {
            this.$["content"].innerHTML = "Server error";
        }
    },



    // render

    refresh: function() {
        var html = "";
        var cats = core.data.calendar_categories;

        for(var id in cats) {
            var c = cats[id];
            html += 
                "<div class='category' style='background:" + (c.color || "") + 
                "; color:" + (c.textcolor || "") + 
                "'>" + cats[id].title + "</div>";
        }
        this.$["content"].innerHTML = "<div class='events_categories'>" + html + "</div>";
    }


};
core.apps.events_categories.extendPrototype(core.components.html_component);
core.apps.events_categories.extendPrototype(core.components.desktop_app);