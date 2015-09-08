core.apps.embed_video.extendPrototype({

    onFirstRun: function() {
        this.showSettings();
    },

    settingsBlocks: [
        { title: "Search video:",
          controls: [
            { tag: "wsc_select", id: "search_type",
              options: [
                { value: "http://video.google.com/videosearch?q=", text: "Google Video" },
//                { value: "http://www.brightcove.tv/search.jsp?query=", text: "BrightCove" },
                { value: "http://youtube.com/results?search_query=", text: "YouTube" },
                { value: "http://www.dailymotion.com/relevance/search/", text: "DailyMotion" },
                { value: "http://www.spike.com/search?query=", text: "iFilm" },
                { value: "http://vimeo.com/videos/search:", text: "Vimeo" },
                { value: "http://www.buzznet.com/www/search/videos/", text: "BuzzNet" }
              ]},
            { tag: "div", innerHTML: "Search:" },
            { tag: "wsc_text", id: "inp_search" },
            { tag: "wsc_button", title: " Go ",
              events: { onclick: "findVideo"} }
          ]},

        { title: "Height:", 
          controls: [
            { tag: "wsc_text", 
              id: "inp_height" }
          ]},

        { title: "Embed code:", 
          controls: [
            { tag: "wsc_textarea", id: "inp_code",
              style: { height: "100px" } }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_code"].value = this.profile["code"];
        this.$["inp_height"].value = this.profile["embed_video_height"];
    },


    processSettingsForm: function() {
        var el = this.$["inp_height"];
        el.value = Math.abs(parseInt(el.value, 10)) || this.defaultProfile["embed_video_height"];
        this.profile["embed_video_height"] = el.value;
        this.profile["code"] = this.$["inp_code"].value;
    },


    onSettingsUpdated: function() {
        this.renderembed_videoCode();
    },


    findVideo: function() {
        window.open(this.$["search_type"].value+escape(this.$["inp_search"].value));
    }

});