core.apps.videoplayer.extendPrototype({

    resize_params: {
        target_element: "player_box"
    },


    onFirstRun: function() {
        this.showSettings();
        this.$["inp_file"].onSelectClick();
    },



    settingsBlocks: [
        { title: "File:", 
          controls: [
            { tag: "wsc_file", id: "inp_file", type: "video" }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_file"].setValue(this.profile["file"]);
    },

    processSettingsForm: function() {
        this.profile["file"] = this.$["inp_file"].value;
    },

    onSettingsUpdated: function() {
        this.render();
    }

});