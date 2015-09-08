core.apps.embed_flash.extendPrototype({

    onFirstRun: function() {
        this.showSettings();
    },


    settingsBlocks: [
        { title: "Code:", 
          controls: [
            { tag: "wsc_textarea", id: "inp_code",
              style: { height: "100px" } },
            { tag: "a", innerHTML: "Select file",
              events: { onclick: "onSelectFileClick" }}
          ]},
        { title: "Height:", 
          controls: [
            { tag: "wsc_size", hide: "w",
              id: "inp_height" }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_code"].value = this.profile["code"];
        this.$["inp_height"].setValue({ height: this.profile["embed_flash_height"]});
    },


    processSettingsForm: function() {
        this.profile["embed_flash_height"] = this.$["inp_height"].value.height;
        this.profile["code"] = this.$["inp_code"].value;
    },


    onSettingsUpdated: function() {
        this.renderembed_flashCode();
    },


    onSelectFileClick: function() {
        desktop.openFilesManager(this.onFileSelected.bind(this), "flash");
    },


    onFileSelected: function(file) {
        file = core.common.getUserFile(file);
        this.$["inp_code"].value = 
            '<object width="100%" height="100%">' +
            '<param name="movie" value="' + file + '"></param>' +
            '<embed src="' + file + '" type="application/x-shockwave-flash" height="100%" width="100%" wmode="Opaque"></embed>' +
            '</object>';
    }


});