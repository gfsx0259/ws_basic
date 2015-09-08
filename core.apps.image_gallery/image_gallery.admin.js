core.apps.image_gallery.extendPrototype({

    compatible_apps: [
        "slideshow",
        "thumbnails",
        "slideshow_thumbs"
    ],


    onFirstRun: function() {
        this.showSettings();
        this.openImagesManager(true);
    },




    settingsBlocks: [
        { title: "Images:",
          controls: [
            { tag: "a", events: { onclick: "openImagesManager" },
              html: "Manage images" }
          ]},

        { title: "Popup:", 
          controls: [
            { tag: "wsc_checkbox", title: "Enable picture popup on click", id: "inp_popup" },
          ]},

        { title: "Show documents:",
            controls: [
                { tag: "wsc_checkbox", title: "Show document instead of images", id: "inp_show_documents" },
            ]},


        { title: "Columns:",
          controls: [
            { tag: "wsc_slider", id: "inp_cols",
              range: { min: 1, max: 20 } }
          ]},

        { title: "Images per page:",
          controls: [
            { tag: "wsc_slider", id: "inp_items_per_page",
              range: { min: 1, max: 100 } }
          ]},

        { title: "Image height:",
          controls: [
            { tag: "wsc_size", hide: "w", id: "inp_image_height" }
          ]},

        { title: "Image margin:", 
          controls: [
            { tag: "wsc_slider", id: "inp_spacing",
              range: { min: 0, max: 100 } }
          ]}
    ],



    fillSettingsForm: function() {
        this.$["inp_popup"].setChecked(this.profile["popup"]);
        this.$["inp_image_height"].setValue({ height: this.profile["image_height"] });
        this.$["inp_items_per_page"].setValue(this.profile["items_per_page"]);
        this.$["inp_cols"].setValue(this.profile["cols"]);
        this.$["inp_spacing"].setValue(this.profile["spacing"]);
        this.$["inp_show_documents"].setChecked(this.profile["show_documents"]);
    },

    processSettingsForm: function() {
        this.profile["popup"] = this.$["inp_popup"].checked;
        this.profile["image_height"] = this.$["inp_image_height"].value.height || this.defaultProfile["image_height"];
        this.profile["items_per_page"] = this.$["inp_items_per_page"].value;
        this.profile["cols"] = this.$["inp_cols"].value;
        this.profile["spacing"] = this.$["inp_spacing"].value;
        this.profile["show_documents"] = this.$["inp_show_documents"].checked;
    },




    onSettingsUpdated: function() {
        this.refresh();
    },



    
    openImagesManager: function(flag, selected_item_idx) {
        core.values.list_editor = {
            popup_title: "Thumbnails manager",
            list: this.getItemsList(),
            callback: this.setItemsList.bind(this),
            add_action: "select_file",
            auto_add: flag === true,
            default_item: {
//                title: "Image",
                file: "",
                alt: "",
                url: "",
                code: "",
                html: "",
                doc:" "
            },
            labels: {
//                title: "Title:",
                file: "Picture:",
                alt: "Alt attribute",
                url: "URL:",
                code: "Code",
                html: "Description",
                doc:"Document"
            },
            add_action: "select_file",
            files_filter: "pictures",
            selected_item_idx: selected_item_idx
        }
        desktop.showPopupApp("list_editor");
    },




    // data

    getItemsList: function() {
        return clone(this.profile.items);
    },


    setItemsList: function(list) {
        this.profile.items = list;
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
    },






    getUsedImages: function() {
        var res = [], p;
        for(var i=0; i<this.profile.items.length; i++) {    
            p = this.profile.items[i];
            if(p.file) {
                res.push({ file: p.file, title: p.alt || "" });
            }
        }
        return res;
    }


});