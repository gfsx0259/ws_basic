core.apps.picture.extendPrototype({


    compatible_apps: [
        "image_gallery",
        "thumbnails",
        "slideshow",
        "slideshow_thumbs"
    ],


    resize_params: {
        min_height: 0,
        target_element: null,
        callback_name: "onResize"
    },



    onFirstRun: function() {
        this.showSettings();
        this.$["inp_file"].onSelectClick();
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

        { title: "Picture:", 
          controls: [
            { tag: "wsc_file", id:"inp_file", type: "pictures" }
          ]},

        { title: "Picture position:", 
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

        { title: "Alt attribute:", 
          controls: [
            { tag: "wsc_text", id: "inp_alt" }
          ]},

        { title: "Popup:", 
          controls: [
            { tag: "wsc_checkbox", title: "Enable picture popup on click", id: "inp_popup" }
          ]},


        { title: "Link:", 
          controls: [
            { tag: "div", innerHTML: "enter URL" },
            { tag: "wsc_text", id: "inp_url" },
            { tag: "div", innerHTML: "or select page" },
            { tag: "wsc_select", id: "inp_url_page",
              events: { onchange: "onLinkPageChanged" },
              options: [
                { text: "...", value: "" }
              ]}
          ]}
    ],


    onSettingsRendered: function() {
        if(core.usertype < USERTYPE_ADMIN) {
            this.hideElement("lnk_edit_image");
        }

        var pl = core.data.pages_list;
        var opts = [ { text: "...", value: "" } ];
        for(var i=0; i<pl.length; i++) {
            opts.push({ text: pl[i].name, value: pl[i].url });
        }

        this.$["inp_url_page"].setOptions(opts);
    },


    fillSettingsForm: function() {
        this.$["inp_variable_content"].setChecked(this.profile["variable_content"]);
        this.$["inp_hide_if_empty"].setChecked(this.profile["hide_if_empty"]);
        this.$["inp_height"].setValue({ height: this.profile["height"]});
        this.$["inp_popup"].setChecked(this.profile["popup"]);
        this.$["inp_file"].setValue(this.profile["path"] || "");
        this.$["inp_alt"].value = this.profile["alt"] || "";
        this.$["inp_picture_position"].setValue(this.profile["picture_position"]);
        this.$["inp_url"].value = this.profile["url"];
    },



    processSettingsForm: function() {
        this.profile["variable_content"] = this.$["inp_variable_content"].checked;
        this.profile["hide_if_empty"] = this.$["inp_hide_if_empty"].checked;
        this.profile["height"] = this.$["inp_height"].value.height;
        this.profile["popup"] = this.$["inp_popup"].checked ? 1 : 0;
        this.profile["path"] = this.$["inp_file"].value;
        this.profile["alt"] = this.$["inp_alt"].value;
        this.profile["picture_position"] = this.$["inp_picture_position"].value;
        this.profile["url"] = this.$["inp_url"].value.trim();
    },


    onSettingsUpdated: function() {
        this.refresh();
    },



    onLinkPageChanged: function() {
        this.$["inp_url"].value = "/" + this.$["inp_url_page"].value + ".html";
    },



    getUsedImages: function() {
        return this.profile["path"] ? [ 
            { file: this.profile["path"], title: this.profile["alt"] } 
        ] : null;
    },



    getCompatibleData: function() {
        var res = {
            title: this.profile.title,
            list: [
                { title: this.profile.alt,
                  alt: this.profile.alt,
                  file: this.profile.path,
                  url: this.profile.url }
            ]
        };
        return res;
    }


});