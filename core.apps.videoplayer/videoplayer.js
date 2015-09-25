core.apps.videoplayer = function(args) {
    this.defaultProfile = {
        title: "",
        app_style: "",
        height: "240",
        file: ""
    }
};

core.apps.videoplayer.prototype = {

    buildContent: function(el) {
        this.buildModel(this.$["content"], 
            { tag: "div", id: "player_box",
              style: { position: "relative" },
              childs: [
                { tag: "div", id: "video_container" }
              ]}
        );
        this.$["video_container"].id = "video_container" + this.id;
        this.$["player_box"].style.height = this.profile.height + "px";
        this.render();
    },

    onOpen: function() {
        this.setTitle(this.profile["title"]);
    },

    render: function() {
        if(!this.profile["file"]) return;
        swfobject.embedSWF(
            "/vendor/generdyn/basic/core.apps.videoplayer/swf/player_video.swf",
            "video_container" + this.id,
            "100%", "100%",
            "9", "",
            { file: core.common.getUserFile(this.profile["file"]) },
            { wmode: "Opaque", allowfullscreen: true, allowscriptaccess: "always" }
        );
    }

};

core.apps.videoplayer.extendPrototype(core.components.html_component);
core.apps.videoplayer.extendPrototype(core.components.desktop_app);