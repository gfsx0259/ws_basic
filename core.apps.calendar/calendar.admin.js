core.apps.calendar.extendPrototype({


    settingsBlocks: [
        { title: "Layout:", 
          controls: [
            { tag: "wsc_select", id: "inp_layout",
              options: [
                { text: "Calendar", value: "calendar" },
                { text: "List", value: "list" }
              ]}
          ]},
        { title: "Show:", 
          controls: [
            { tag: "wsc_slider", id: "inp_monthes_count",
              options: [
                { text: "1 month", value: 1 },
                { text: "2 monthes", value: 2 },
                { text: "3 monthes", value: 3 },
                { text: "4 monthes", value: 4 },
                { text: "5 monthes", value: 5 },
                { text: "6 monthes", value: 6 },
                { text: "7 monthes", value: 7 },
                { text: "8 monthes", value: 8 },
                { text: "9 monthes", value: 9 },
                { text: "10 monthes", value: 10 },
                { text: "11 monthes", value: 11 },
                { text: "1 year", value: 12 }
              ]}
          ]},
        { title: "Filter by tags:", 
          controls: [
            { tag: "wsc_text", id: "inp_filter" }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_filter"].value = this.profile["filter"];
        this.$["inp_monthes_count"].setValue(this.profile["monthes_count"]);
        this.$["inp_layout"].setValue(this.profile["layout"]);
    },

    processSettingsForm: function() {
        this.profile["filter"] = this.$["inp_filter"].value;
        this.profile["monthes_count"] = this.$["inp_monthes_count"].value;
        this.profile["layout"] = this.$["inp_layout"].value;
    },

    onSettingsUpdated: function() {
    /*
        if(this.viewMode == "calendar") {
            this.$["calContentDiv"].style.minHeight = this.profile["height"]+"px";
        }
        */
        this.filterEventsByTags();
        this.render();
    }

    
});