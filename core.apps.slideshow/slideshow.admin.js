core.apps.slideshow.extendPrototype({


    compatible_apps: [
        "image_gallery",
        "thumbnails",
        "slideshow_thumbs"
    ],


    resize_params: {
        target_element: "box",
        callback_name: "onResize"
    },


    onResize: function() {
        this.updateBoxSize();
    },


    onFirstRun: function() {
        this.showSettings();
        this.openImagesManager(true);
    },


    settingsBlocks: [
        { title: "Content:",
          primary: true,
          controls: [
            { tag: "wsc_checkbox", title: "Variable content", id: "inp_variable_content" },
            { tag: "wsc_checkbox", title: "Hide if empty", id: "inp_hide_if_empty" }
          ]},
              
        { title: "Height:", 
          controls: [
            { tag: "wsc_size", hide: "w",
              id: "inp_height" }
          ]},

        { title: "Interval:", 
          controls: [
            { tag: "wsc_slider", id: "inp_interval",
              options: [
                { text: "1 sec", value: "1" },
                { text: "2 sec", value: "2" },
                { text: "3 sec", value: "3" },
                { text: "5 sec", value: "5" },
                { text: "10 sec", value: "10" },
                { text: "15 sec", value: "15" },
                { text: "20 sec", value: "20" },
                { text: "30 sec", value: "30" },
                { text: "45 sec", value: "45" },
                { text: "1 min", value: "60" }
              ]}
          ]},


        { title: "Effects:", 
          controls: [
            { tag: "wsc_select", id: "sel_effect", 
              options: [
                { text: "Fade", value: "fade" },
                { text: "Scroll", value: "scroll" },
                { text: "None", value: "none" }
              ]}
          ]},

        { title: "Image position:", 
          controls: [
            { tag: "wsc_select", id:"inp_picture_position",
              options: [
                { text: "Size height", value: "size_height" },
                { text: "Size width", value: "size_width" },
                { text: "Fit", value: "fit" },
                { text: "Fill", value: "fill" },
                { text: "Center", value: "center" },
                { text: "Stretch", value: "stretch" }
              ]}
          ]},

        { title: "Image settings:", 
          controls: [
            { tag: "wsc_checkbox", title: "Enable image popup on click", id: "inp_popup" },
            { tag: "div", className: "divider"},
            { tag: "wsc_checkbox", title: "Show navigation bar", id: "inp_numbers" },
            { tag: "div", className: "divider"},
            { tag: "wsc_checkbox", title: "Display images title at navigation bar", id: "inp_title_in_nav" },
            { tag: "div", className: "divider"},
            { tag: "wsc_checkbox", title: "Show images on mouse over navigation bar", id: "inp_nav_handle_mouseover" },
            { tag: "div", className: "divider"},
            { tag: "wsc_checkbox", title: "Show image description", id: "inp_caption" }
          ]},


        { title: "Images source:",
          controls: [
            { tag: "wsc_select", id: "inp_src", 
              events: { onchange: "onSourceChanged" },
              options: [
                { text: "Editable list", value: "list" },
                { text: "Search results by keyword(s)", value: "search" }
              ]},
            { tag: "div", className: "divider" },

            { tag: "div", id: "control_images_list",
              display: false,
              childs: [
                { tag: "a", events: { onclick: "openImagesManager" },
                  html: "Manage images list" }
              ]},
            { tag: "div", id: "control_images_search",
              display: false,
              childs: [
                { tag: "wsc_text", id: "inp_keywords" }
              ]}
          ]}
    ],


    onSourceChanged: function() {
        if(this.$["inp_src"].value == "list") {
            this.showElement("control_images_list");
            this.hideElement("control_images_search");
        } else {
            this.hideElement("control_images_list");
            this.showElement("control_images_search");
        }
    },



    fillSettingsForm: function() {
        this.$["inp_variable_content"].setChecked(this.profile["variable_content"]);
        this.$["inp_hide_if_empty"].setChecked(this.profile["hide_if_empty"]);
        this.$["inp_height"].setValue({ height: this.profile["height"]});
        this.$["inp_interval"].setValue(this.profile["interval"]);
        this.$["sel_effect"].setValue(this.profile["effect"]);
        this.$["inp_popup"].setChecked(this.profile["popup"]);
        this.$["inp_numbers"].setChecked(this.profile["numbers"]);
        this.$["inp_caption"].setChecked(this.profile["caption"]);
        this.$["inp_nav_handle_mouseover"].setChecked(this.profile["nav_handle_mouseover"]);
        this.$["inp_title_in_nav"].setChecked(this.profile["title_in_nav"]);
        this.$["inp_src"].setValue(this.profile["keywords"] ? "search" : "list");
        this.$["inp_picture_position"].setValue(this.profile["picture_position"]);
        this.onSourceChanged();
    },



    processSettingsForm: function() {
        this.profile["variable_content"] = this.$["inp_variable_content"].checked;
        this.profile["hide_if_empty"] = this.$["inp_hide_if_empty"].checked;
        this.profile["height"] = this.$["inp_height"].value.height;
        this.profile["interval"] = this.$["inp_interval"].value;

        this.profile["popup"] = this.$["inp_popup"].checked ? 1 : 0;
        this.profile["numbers"] = this.$["inp_numbers"].checked ? 1 : 0;
        this.profile["caption"] = this.$["inp_caption"].checked ? 1 : 0;  
        this.profile["nav_handle_mouseover"] = this.$["inp_nav_handle_mouseover"].checked ? 1 : 0;
        this.profile["title_in_nav"] = this.$["inp_title_in_nav"].checked ? 1 : 0;

        this.profile["effect"] = this.$["sel_effect"].value;

        if(this.$["inp_src"].value == "list") {
            this.profile["keywords"] = "";
        } else {
            this.profile["keywords"] = this.$["inp_keywords"].value.trim();
        }
        this.profile["picture_position"] = this.$["inp_picture_position"].value;
    },


    onSettingsUpdated: function() {
        this.is_scroll = false;
        this.is_show_started = false;
        this.slides = false;
        this.refresh();
    },


    
    // images list

    openImagesManager: function(flag) {
        core.values.list_editor = {
            popup_title: "Slideshow images",
            list: this.getItemsList(),
            callback: this.setItemsList.bind(this),
            add_action: "select_file",
            auto_add: flag === true,
            default_item: {
                title: "Image",
                alt: "",
                file: "",
                url: ""
            },
            labels: {
                title: "Title:",
                alt: "Alt attribute:",
                file: "Image:",
                url: "Link URL:"
            },
            add_action: "select_file",
            files_filter: "pictures"
        }
        desktop.showPopupApp("list_editor");
    },





    // sys

    getUsedImages: function() {
        var res = [];
        if(this.profile["keywords"] != "") {
            for(var i=0; i<this.profile["images"].length; i++) {
                var img = this.profile["images"][i];
                var alt = this.profile["alts"][i];
                if(img) {
                    res.push({ file: img, title: alt || "" });
                }
            }
        }
        return res;
    },


    onClose: function() {
        clearTimeout(this.timeout);
    },


    // data

    getItemsList: function() {
        var p = this.profile;
        var list = [];
        for(var i=0; i<p.labels.length; i++) {
            list.push({
                title: p.labels[i],
                file: p.images[i],
                alt: p.alts[i],
                url: p.urls[i] || ""
            });
        }
        return list;
    },


    setItemsList: function(list) {
        var p = this.profile;
        p.labels = [];
        p.images = [];
        p.urls = [];
        for(var i=0; i<list.length; i++) {
            p.labels[i] = list[i].title;
            p.images[i] = list[i].file;
            p.alts[i] = list[i].alt;
            p.urls[i] = list[i].url;
        }


        if(this.refresh_flag) {
            this.refresh_flag = false;
            this.onSettingsUpdated();
        }
    },




    getCompatibleData: function() {
        var res = {
            title: this.profile.title,
            list: this.getItemsList()
        }
        return res;
    },


    setCompatibleData: function(data) {
        for(var k in data) {
            if(k == "list") {
                this.setItemsList(data[k]);
            } else {
                this.profile[k] = data[k];
            }
        }
        this.profile["keywords"] = "";
    },




    onFocus: function() {
        if(!this.$["btn_add"]) {
            this.buildModel(this.$["slideshow"],
                { tag: "div", className: "btn_add_image_wrapper",
                  id: "btn_add_image_wrapper",
                  childs: [
                    { tag: "div", className: "btn_add_image",
                      events: { onclick: "onBtnAddImageClick" } }
                  ]}
            );
        } else {
            this.showElement("btn_add_image_wrapper");
        }
    },


    onBlur: function() {
        this.hideElement("btn_add_image_wrapper");
    },


    onBtnAddImageClick: function() {
        this.refresh_flag = true;
        this.openImagesManager(true);
    }



});